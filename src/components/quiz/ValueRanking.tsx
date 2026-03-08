import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getValueByKey, type ValueKey } from '@/lib/values';

interface Props {
  coreValues: ValueKey[];
  onComplete: (ranked: ValueKey[]) => void;
}

export function ValueRanking({ coreValues, onComplete }: Props) {
  const [items, setItems] = useState<ValueKey[]>(coreValues);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems(prev => {
        const oldIndex = prev.indexOf(active.id as ValueKey);
        const newIndex = prev.indexOf(over.id as ValueKey);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <p className="text-xs font-display uppercase tracking-widest text-accent">Value Ranking</p>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
          Rank your core values
        </h2>
        <p className="text-sm text-muted-foreground">Drag to reorder. #1 is your most important value.</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((key, index) => (
              <SortableValueCard key={key} valueKey={key} rank={index + 1} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        onClick={() => onComplete(items)}
        className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-display font-medium hover:opacity-90 transition-opacity"
      >
        Continue
      </button>
    </div>
  );
}

function SortableValueCard({ valueKey, rank }: { valueKey: ValueKey; rank: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: valueKey });
  const value = getValueByKey(valueKey);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-4 px-5 py-4 rounded-lg bg-card border-2 cursor-grab active:cursor-grabbing transition-shadow ${
        isDragging ? 'border-primary shadow-lg' : 'border-border'
      }`}
    >
      <span className="text-lg font-display font-bold text-accent w-8">{rank}</span>
      <span className="text-2xl">{value.emoji}</span>
      <div className="flex-1">
        <p className="font-display font-medium text-foreground">{value.label}</p>
      </div>
      <span className="text-muted-foreground text-lg">⠿</span>
    </div>
  );
}
