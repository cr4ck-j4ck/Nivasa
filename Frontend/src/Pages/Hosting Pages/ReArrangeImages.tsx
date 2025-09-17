import {
  DndContext,
  closestCenter,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useState } from "react";
import { useHostingProcessStore } from "@/Store/HostingProcessStore";
import { useShallow } from "zustand/react/shallow";

export default function ImageReorderer() {
  const { images, reorderImages } = useHostingProcessStore(
    useShallow((state) => ({
      images: state.images,
      reorderImages: state.reorderImages,
    }))
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);

      let newImages = arrayMove(images, oldIndex, newIndex);

      // 🔥 update order field
      newImages = newImages.map((img, index) => ({
        ...img,
        order: index,
      }));

      reorderImages(newImages);
    }
    setActiveId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  const activeImage = images.find((img) => img.id === activeId);

  return (
    <div className="max-w-6xl mx-auto p-4 pb-80 top-70 relative">
      <h1 className="text-4xl font-semibold mb-4">Ta-da! How does this look?</h1>
      <p className="text-lg text-gray-800 font-bold mb-2">Drag to reorder</p>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* --- Cover photo always index 0 --- */}
        {images.length > 0 && (
          <div className="mb-4">
            <SortableContext items={[images[0].id]}>
              <SortableItem
                id={images[0].id}
                url={images[0].url}
                isCover={true}
                coverClass="h-64 w-full"
              />
            </SortableContext>
          </div>
        )}

        {/* --- Other photos in grid --- */}
        <SortableContext
          items={images.slice(1).map((img) => img.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 gap-4">
            {images.slice(1).map((img) => (
              <SortableItem key={img.id} id={img.id} url={img.url} isCover={false} />
            ))}

          </div>
        </SortableContext>

        {/* Floating preview while dragging */}
        <DragOverlay>
          {activeImage ? (
            <img
              src={activeImage.url}
              alt={`img-${activeImage.id}`}
              className="rounded-lg object-cover w-full h-48 opacity-80 cursor-grabbing"
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function SortableItem({
  id,
  url,
  isCover,
  coverClass,
}: {
  id: string;
  url: string;
  isCover: boolean;
  coverClass?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative">
      <img
        src={url}
        alt={`img-${id}`}
        className={`rounded-lg object-cover w-full ${isCover ? coverClass : "h-48"}`}
      />
      {isCover && (
        <span className="absolute top-2 left-2 bg-white text-xs text-black px-2 py-1 rounded">
          Cover Photo
        </span>
      )}
    </div>
  );
}
