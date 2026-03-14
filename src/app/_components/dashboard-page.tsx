"use client";

import { api } from "~/trpc/react";
import { BlockCard } from "./block-card";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { type RouterOutputs } from "~/trpc/react";
import { useEffect, useRef, useState } from "react";
import { DashboardSettingsPanel } from "./dashboard-settings";
import { DashboardDesignPanel } from "./dashboard-design";
import { defaultTheme, deepMergeTheme } from "~/lib/theme";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type Block = RouterOutputs["block"]["getAll"][number];

type DashboardContentProps = {
  initialTab?: "editor" | "design" | "settings";
};

export function DashboardContent({
  initialTab = "editor",
}: DashboardContentProps) {
  const utils = api.useUtils();

  const { data: blocks, isLoading } = api.block.getAll.useQuery();

  const { data: profile, isLoading: isProfileLoading } =
    api.profile.getMe.useQuery();
  const createProfile = api.profile.createInitial.useMutation();

  const createAttemptedRef = useRef(false);

  useEffect(() => {
    if (!isProfileLoading && !profile && !createAttemptedRef.current) {
      createProfile.mutate();
      createAttemptedRef.current = true;
    }
  }, [profile, isProfileLoading, createProfile]);

  const addBlock = api.block.add.useMutation({
    onMutate: async () => {
      await utils.block.getAll.cancel();
      const previousBlocks = utils.block.getAll.getData();

      utils.block.getAll.setData(undefined, (old) => [
        {
          id: crypto.randomUUID(),
          title: "Neuer Link",
          url: "",
          type: "link",
          order: old?.length ?? 0,
        } as Block,
        ...(old ?? []),
      ]);

      return { previousBlocks };
    },
    onError: (_err, _newBlock, context) => {
      utils.block.getAll.setData(undefined, context?.previousBlocks);
    },
    onSettled: () => {
      void utils.block.getAll.invalidate();
    },
  });

  const [activeTab, setActiveTab] = useState<"editor" | "design" | "settings">(
    initialTab,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const reorderMutation = api.block.reorder.useMutation({
    onMutate: async (newOrderItems) => {
      await utils.block.getAll.cancel();
      const previousBlocks = utils.block.getAll.getData();

      if (previousBlocks) {
        const itemMap = new Map(previousBlocks.map((b) => [b.id, b]));
        const newOrder = newOrderItems
          .map((item) => itemMap.get(item.id))
          .filter(Boolean) as Block[];
        utils.block.getAll.setData(undefined, newOrder);
      }

      return { previousBlocks };
    },
    onError: (_err, _newOrderItems, context) => {
      utils.block.getAll.setData(undefined, context?.previousBlocks);
      alert("Fehler beim Sortieren.");
    },
    onSettled: () => {
      void utils.block.getAll.invalidate();
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || !blocks) return;

    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(blocks, oldIndex, newIndex);

        reorderMutation.mutate(
          newOrder.map((b, index) => ({ id: b.id, order: index })),
        );
      }
    }
  }

  return (
    <div className="font-body min-h-screen bg-[#fafafa] text-slate-900">
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-12 p-6 lg:grid-cols-[1fr_400px]">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tight">
                {activeTab === "editor"
                  ? "Editor"
                  : activeTab === "design"
                    ? "Design"
                    : "Einstellungen"}
              </h1>
              <p className="mt-2 text-slate-500">
                {activeTab === "editor"
                  ? "Erstelle und verwalte deine Profil-Blöcke."
                  : activeTab === "design"
                    ? "Passe Farben, Schriften und Buttons an."
                    : "Passe dein öffentliches Profil und deinen Account an."}
              </p>
            </div>
            <div className="mt-2 inline-flex shrink-0 items-center rounded-full bg-slate-100 p-1 text-xs font-bold text-slate-500">
              <button
                type="button"
                onClick={() => setActiveTab("editor")}
                className={`rounded-full px-4 py-1.5 transition-all ${
                  activeTab === "editor"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("design")}
                className={`rounded-full px-4 py-1.5 transition-all ${
                  activeTab === "design"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Design
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`rounded-full px-4 py-1.5 transition-all ${
                  activeTab === "settings"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Einstellungen
              </button>
            </div>
          </div>

          {activeTab === "editor" ? (
            <>
              <button
                onClick={() => addBlock.mutate({ type: "link" })}
                disabled={addBlock.isPending}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 p-6 transition-all hover:border-blue-400 hover:bg-blue-50/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <span className="text-2xl">+</span>
                </div>
                <span className="font-bold text-slate-400 group-hover:text-blue-600">
                  {addBlock.isPending
                    ? "Wird erstellt..."
                    : "Neuen Link hinzufügen"}
                </span>
              </button>

              <div className="flex flex-col gap-4">
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-32 w-full animate-pulse rounded-[2.5rem] bg-white shadow-sm"
                    />
                  ))
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={blocks?.map((b) => b.id) ?? []}
                      strategy={verticalListSortingStrategy}
                    >
                      {blocks?.map((block) => (
                        <BlockCard key={block.id} block={block} />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </>
          ) : activeTab === "design" ? (
            <DashboardDesignPanel />
          ) : (
            <DashboardSettingsPanel />
          )}
        </div>

        <aside className="relative z-0 hidden lg:block">
          <div className="sticky top-12 flex flex-col items-center">
            {(() => {
              const previewTheme = deepMergeTheme(defaultTheme, profile?.theme);
              return (
                <div
                  className="relative h-[720px] w-[350px] overflow-hidden rounded-[3.5rem] border-12 border-slate-900 shadow-2xl"
                  style={{
                    backgroundColor: previewTheme.backgroundColor,
                    color: previewTheme.textColor,
                    fontFamily: previewTheme.fontFamily,
                  }}
                >
                  <div className="absolute top-0 left-1/2 z-20 h-7 w-36 -translate-x-1/2 rounded-b-3xl bg-slate-900" />

                  <div className="custom-scrollbar h-full w-full overflow-y-auto px-6 pt-24 pb-12 text-center">
                    <div className="mx-auto mb-4 h-24 w-24 shrink-0 rounded-full border-[3px] border-blue-500/10 p-1.5 shadow-sm">
                      <div className="h-full w-full rounded-full bg-slate-100 shadow-inner" />
                    </div>

                    <div
                      className="mx-auto mb-2 h-4 w-32 shrink-0 rounded-full"
                      style={{
                        backgroundColor: previewTheme.textColor,
                        opacity: 0.1,
                      }}
                    />
                    <div
                      className="mx-auto mb-10 h-3 w-40 shrink-0 rounded-full"
                      style={{
                        backgroundColor: previewTheme.textColor,
                        opacity: 0.05,
                      }}
                    />

                    <div className="w-full space-y-3">
                      {blocks?.map((block) => {
                        const btnTheme = previewTheme.buttonStyle;
                        const shadowClass =
                          (
                            {
                              none: "",
                              sm: "shadow-sm",
                              md: "shadow-md",
                              lg: "shadow-lg",
                              xl: "shadow-xl",
                            } as Record<string, string>
                          )[btnTheme.shadow] ?? "shadow-sm";

                        return (
                          <div
                            key={block.id}
                            className={`w-full px-4 py-4 text-center text-sm font-bold transition-all hover:scale-[1.02] ${shadowClass}`}
                            style={{
                              backgroundColor: btnTheme.backgroundColor,
                              color: btnTheme.textColor,
                              borderColor: btnTheme.borderColor,
                              borderWidth: `${btnTheme.borderWidth}px`,
                              borderStyle:
                                btnTheme.borderWidth > 0 ? "solid" : "none",
                              borderRadius: `${btnTheme.borderRadius}px`,
                            }}
                          >
                            {block.title ?? "Unbenannt"}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-10 shrink-0 pb-4">
                      <p
                        className="font-display text-[10px] font-black tracking-widest uppercase"
                        style={{
                          color: previewTheme.textColor,
                          opacity: 0.2,
                        }}
                      >
                        PLYST.CC
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="mt-8 flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              Live Vorschau
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
