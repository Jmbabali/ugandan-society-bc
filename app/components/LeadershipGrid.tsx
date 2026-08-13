"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";

export type LeadershipProfile = {
  name: string;
  role: string;
  image: string;
  initials: string;
  bio: string;
};

type LeadershipGridProps = {
  members: LeadershipProfile[];
  groupLabel: string;
};

export default function LeadershipGrid({
  members,
  groupLabel,
}: LeadershipGridProps) {
  const [selectedMember, setSelectedMember] =
    useState<LeadershipProfile | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  const closeBiography = useCallback(() => {
    setSelectedMember(null);
    window.requestAnimationFrame(() => triggerButtonRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!selectedMember) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeBiography();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeBiography, selectedMember]);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {members.map((member) => (
          <article
            key={member.name}
            className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="h-2 bg-gradient-to-r from-black via-yellow-400 to-red-600" />

            <button
              type="button"
              onClick={(event) => {
                triggerButtonRef.current = event.currentTarget;
                setSelectedMember(member);
              }}
              className="group relative block aspect-[4/5] w-full overflow-hidden bg-gray-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-yellow-400"
              aria-label={`Read ${member.name}'s biography`}
              aria-haspopup="dialog"
            >
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                  className="object-cover object-top transition duration-500 group-hover:scale-105"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-gray-950 text-4xl font-black text-yellow-400">
                  {member.initials}
                </span>
              )}

              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-4 pb-4 pt-12 text-left text-sm font-bold text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                Click to read biography
              </span>
            </button>

            <div className="p-5 text-center">
              <h3 className="text-xl font-black text-gray-950">
                {member.name}
              </h3>

              <p className="mt-2 text-sm font-black uppercase tracking-wide text-red-600">
                {member.role}
              </p>
            </div>
          </article>
        ))}
      </div>

      {selectedMember ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm md:p-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeBiography();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeBiography}
              className="sticky right-4 top-4 z-10 ml-auto mr-4 mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-950 text-white shadow-lg transition hover:bg-red-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400"
              aria-label="Close biography"
            >
              <X aria-hidden="true" className="h-6 w-6" />
            </button>

            <div className="grid gap-8 px-6 pb-8 md:grid-cols-[280px_1fr] md:px-10 md:pb-10">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-3xl bg-gray-200 shadow-lg">
                {selectedMember.image ? (
                  <Image
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    fill
                    sizes="280px"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-950 text-5xl font-black text-yellow-400">
                    {selectedMember.initials}
                  </div>
                )}
              </div>

              <div>
                <p className="mb-3 font-black uppercase tracking-widest text-red-600">
                  {groupLabel}
                </p>

                <h2
                  id={titleId}
                  className="text-3xl font-black text-gray-950 md:text-5xl"
                >
                  {selectedMember.name}
                </h2>

                <p className="mt-3 text-lg font-black text-gray-600">
                  {selectedMember.role}
                </p>

                <div
                  id={descriptionId}
                  className="mt-7 space-y-5 text-base leading-8 text-gray-700 md:text-lg"
                >
                  {selectedMember.bio.split(/\n\n+/).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
