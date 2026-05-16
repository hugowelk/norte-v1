import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, GripVertical } from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { VALUES, getValueByKey, type ValueKey, type Value } from '@/lib/values';
import { ValueIcon } from '../ValueIcon';
import { cn } from '@/lib/utils';

export type SelectableValue = { kind: 'core'; key: ValueKey };

export interface CoreValuesResult {
  slots: SelectableValue[];      // length 5, ordered
}

interface Props {
  revealedTop3?: ValueKey[];
  onComplete: (r: CoreValuesResult) => void;
}

const TOTAL_SLOTS = 5;

export function CoreValuesSelection({ revealedTop3, onComplete }: Props) {
  const [slots, setSlots] = useState<(SelectableValue | null)[]>(Array(TOTAL_SLOTS).fill(null));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const filledSlots = slots.filter(Boolean) as SelectableValue[];
  const allFilled = filledSlots.length === TOTAL_SLOTS;

  const slottedKeys = new Set(filledSlots.map(s => `core:${s.key}`));

  const addToNextSlot = (item: SelectableValue) => {
    const key = `core:${item.key}`;
    if (slottedKeys.has(key)) {
      setSlots(prev => prev.map(s => {
        if (!s) return s;
        return `core:${s.key}` === key ? null : s;
      }));
      return;
    }
    const idx = slots.findIndex(s => s === null);
    if (idx === -1) return;
    setSlots(prev => prev.map((s, i) => i === idx ? item : s));
  };

  const removeSlot = (idx: number) => {
    setSlots(prev => prev.map((s, i) => i === idx ? null : s));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = slots.map((s, i) => slotId(s, i));
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from < 0 || to < 0) return;
    setSlots(prev => arrayMove(prev, from, to));
  };

  const handleContinue = () => {
    if (!allFilled) return;
    onComplete({ slots: filledSlots });
  };

  const revealedLabels = revealedTop3?.map(k => getValueByKey(k).label) ?? [];

  return (
    <div className="space-y-10 pb-12">
      <div className="space-y-3 text-center">
        <p className="text-xs font-display uppercase tracking-widest text-accent">Your Aspiration</p>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground leading-tight">
          Now — pick the 5 values you want at the centre of your life.
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Not what came up. What you'd choose if you were choosing on purpose. Put them in priority order.
        </p>
        <p className="text-xs text-muted-foreground pt-1">Tap to add — drag to reorder</p>
      </div>

      {revealedLabels.length === 3 && (
        <div className="rounded-xl bg-accent/10 px-5 py-4">
          <p className="text-sm md:text-base text-foreground/85 leading-relaxed italic font-body">
            Your revealed top 3 were <span className="not-italic font-medium text-foreground">{revealedLabels[0]}</span>, <span className="not-italic font-medium text-foreground">{revealedLabels[1]}</span>, and <span className="not-italic font-medium text-foreground">{revealedLabels[2]}</span>. The interesting question is which of these you want to keep at the centre — and what else you want to bring in.
          </p>
        </div>
      )}

      <div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={slots.map((s, i) => slotId(s, i))} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {slots.map((slot, i) => (
                <SlotRow
                  key={slotId(slot, i)}
                  id={slotId(slot, i)}
                  index={i}
                  item={slot}
                  onRemove={() => removeSlot(i)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="space-y-2.5">
        <p className="text-xs font-display uppercase tracking-widest text-muted-foreground px-1">
          Tap a value to add it
        </p>
        {VALUES.map(v => (
          <LibraryCard
            key={v.key}
            value={v}
            selected={slottedKeys.has(`core:${v.key}`)}
            onClick={() => addToNextSlot({ kind: 'core', key: v.key })}
          />
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!allFilled}
        className={`w-full py-4 rounded-lg font-display font-medium transition-all ${
          allFilled
            ? 'bg-primary text-primary-foreground hover:opacity-90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        {filledSlots.length === 0
          ? 'Pick 5 to continue'
          : allFilled
            ? 'Continue →'
            : `Pick ${TOTAL_SLOTS - filledSlots.length} more`}
      </button>
    </div>
  );
}

function slotId(slot: SelectableValue | null, idx: number): string {
  if (!slot) return `empty-${idx}`;
  return `slot-core-${slot.key}`;
}

function SlotRow({
  id, index, item, onRemove,
}: { id: string; index: number; item: SelectableValue | null; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  if (!item) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-border/60 text-muted-foreground"
      >
        <span className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center font-display text-xs">
          {index + 1}
        </span>
        <span className="text-sm font-body italic">Empty slot</span>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-primary/40 bg-primary/5"
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground touch-none">
        <GripVertical size={16} />
      </button>
      <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-xs font-medium">
        {index + 1}
      </span>
      <ValueIcon value={item.key} size={18} />
      <span className="font-display font-medium text-foreground flex-1">{getValueByKey(item.key).label}</span>
      <button onClick={onRemove} className="text-muted-foreground hover:text-foreground" aria-label="Remove">
        <X size={16} />
      </button>
    </div>
  );
}

function LibraryCard({ value, selected, onClick }: { value: Value; selected: boolean; onClick: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        'rounded-xl border-2 bg-card overflow-hidden transition-colors',
        selected ? 'border-primary/40 bg-primary/5' : 'border-border',
      )}
    >
      <div className="flex items-stretch">
        <button onClick={onClick} className="flex-1 flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors">
          <ValueIcon value={value.key} size={20} />
          <span className="font-display font-medium text-foreground">{value.label}</span>
          {selected && <span className="ml-auto text-xs font-display uppercase tracking-wider text-primary">Added</span>}
        </button>
        <button
          onClick={() => setOpen(o => !o)}
          className="px-3 text-muted-foreground hover:text-foreground border-l border-border/60"
          aria-label="Toggle details"
        >
          <ChevronDown size={16} className={cn('transition-transform', open && 'rotate-180')} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 pt-1 text-sm text-foreground/80 leading-relaxed border-t border-border/60"
          >
            {value.longDescription}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
