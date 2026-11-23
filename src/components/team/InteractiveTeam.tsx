"use client";

import { useState, useMemo } from "react";
import { DIVISIONS, TEAM_DATA, type Division, type TeamMember } from "@/constants/team";

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const CrownIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8z" />
    <path d="M5 19h14" />
  </svg>
);

export const InteractiveTeam = () => {
  const [activeDivision, setActiveDivision] = useState<Division>("Leadership");

  const divisionMembers = useMemo(
    () => TEAM_DATA.filter((m) => m.division === activeDivision),
    [activeDivision]
  );

  const [selectedId, setSelectedId] = useState<string>(() => {
    return TEAM_DATA.find((m) => m.division === "Leadership")?.id || TEAM_DATA[0].id;
  });

  const selectedMember: TeamMember = useMemo(() => {
    return divisionMembers.find((m) => m.id === selectedId) || divisionMembers[0] || TEAM_DATA[0];
  }, [divisionMembers, selectedId]);

  const handleDivisionChange = (div: Division) => {
    setActiveDivision(div);
    const firstMember = TEAM_DATA.find((m) => m.division === div);
    if (firstMember) {
      setSelectedId(firstMember.id);
    }
  };

  const currentIndex = divisionMembers.findIndex((m) => m.id === selectedMember.id);

  const handlePrev = () => {
    if (divisionMembers.length <= 1) return;
    const prevIdx = (currentIndex - 1 + divisionMembers.length) % divisionMembers.length;
    setSelectedId(divisionMembers[prevIdx].id);
  };

  const handleNext = () => {
    if (divisionMembers.length <= 1) return;
    const nextIdx = (currentIndex + 1) % divisionMembers.length;
    setSelectedId(divisionMembers[nextIdx].id);
  };

  return (
    <section className="w-full bg-[#F9FAFB] py-16 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-[#00c2a8] bg-[#e6f9f6] px-3.5 py-1.5 rounded-full inline-block mb-3">
            Keluarga Besar Toentoen
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Orang-Orang Hebat di Balik Toentoen
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Kombinasi talenta teknologi, strategi kemitraan, dan desain yang berdedikasi membangun ekosistem perdagangan lokal yang adil di Indonesia.
          </p>
        </div>

        {/* Division Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {DIVISIONS.map((d) => {
            const isActive = activeDivision === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => handleDivisionChange(d)}
                className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#00c2a8] text-white shadow-md shadow-[#00c2a8]/25 scale-105"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>

        {/* MAIN UNIFIED SHOWCASE CARD (FRAME TERKUNCI PERSIS 300x375 PX - BEBAS BUG DI SEMUA LAYAR) */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0d4f47] p-6 sm:p-10 lg:p-12 text-white shadow-2xl border border-white/10">
          {/* Efek silau diagonal (seperti pada Gambar 2) */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(115deg, transparent 0 140px, rgba(255, 255, 255, 0.07) 140px 220px)",
            }}
          />

          {/* Top Showcase: Foto Kiri + Bio Kanan */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-12 pb-12 sm:pb-16 border-b border-white/10">
            {/* Foto Anggota: Terkunci pada Frame 300px x 375px (4:5) */}
            <div className="shrink-0 flex justify-center w-[300px] max-w-full mx-auto lg:mx-0">
              <div
                className="rounded-2xl overflow-hidden shadow-2xl ring-4 ring-[#00c2a8]/35 bg-gray-900 relative"
                style={{
                  width: "300px",
                  height: "375px",
                  maxWidth: "100%",
                  aspectRatio: "4 / 5",
                }}
              >
                <img
                  key={selectedMember.id}
                  src={selectedMember.imageLarge}
                  alt={selectedMember.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>

            {/* Panel Bio & Profil (Mengisi sisa ruang secara fleksibel) */}
            <div className="w-full flex-1 min-w-0 flex flex-col justify-center text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00c2a8]/20 px-3 py-1 text-xs font-bold text-[#5fd9c4] ring-1 ring-[#00c2a8]/40">
                  <CrownIcon />
                  <span>{selectedMember.division}</span>
                </span>
                {divisionMembers.length > 1 && (
                  <span className="text-[11px] text-teal-200/70 font-medium">
                    Anggota {currentIndex + 1} dari {divisionMembers.length}
                  </span>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-1 tracking-tight">
                {selectedMember.name}
              </h3>
              <p className="text-base sm:text-lg font-semibold text-[#5fd9c4] mb-4">
                {selectedMember.role}
              </p>

              {selectedMember.bio && (
                <p className="text-sm sm:text-base text-gray-200 leading-relaxed mb-6">
                  {selectedMember.bio}
                </p>
              )}

              <blockquote className="rounded-2xl bg-white/10 p-4 sm:p-5 border-l-4 border-[#00c2a8] mb-6 backdrop-blur-xs text-left">
                <p className="text-xs sm:text-sm italic text-teal-100 leading-relaxed">
                  <span className="font-bold text-white">{selectedMember.quoteHighlight}</span>
                  {selectedMember.quoteRest}
                </p>
              </blockquote>

              {selectedMember.linkedinUrl && (
                <div className="flex items-center justify-center lg:justify-start pt-1 pb-2">
                  <a
                    href={selectedMember.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#00c2a8] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#00a892] transition-colors"
                  >
                    <LinkedInIcon />
                    <span>Profil LinkedIn</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Selector: Strip Thumbnail Terpadu (Hanya jika > 1 anggota) */}
          {divisionMembers.length > 1 && (
            <div className="relative z-10 pt-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-200/80">
                  Pilih Anggota {activeDivision}:
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="text-xs font-semibold text-teal-200 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    &larr; Prev
                  </button>
                  <span className="text-xs text-white/30">&middot;</span>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="text-xs font-semibold text-teal-200 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    Next &rarr;
                  </button>
                </div>
              </div>

              {/* Thumbnail Strip Seragam (Terkunci 56px x 70px) */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {divisionMembers.map((member) => {
                  const isSelected = member.id === selectedMember.id;
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setSelectedId(member.id)}
                      className={`group flex items-center gap-2.5 rounded-2xl p-2 transition-all cursor-pointer text-left ${
                        isSelected
                          ? "bg-white/15 ring-2 ring-[#00c2a8] shadow-lg scale-105"
                          : "bg-white/5 hover:bg-white/10 opacity-70 hover:opacity-100"
                      }`}
                    >
                      {/* Thumbnail Frame Seragam */}
                      <div
                        className="rounded-xl overflow-hidden shrink-0 bg-gray-900 border border-white/20 shadow-xs"
                        style={{ width: "52px", height: "65px" }}
                      >
                        <img
                          src={member.imageLarge}
                          alt={member.name}
                          className="w-full h-full object-cover object-center"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div className="pr-2">
                        <p className={`text-xs font-bold leading-tight ${isSelected ? "text-white" : "text-gray-200"}`}>
                          {member.name.split(" ")[0]} {member.name.split(" ")[1] || ""}
                        </p>
                        <p className="text-[10px] text-[#5fd9c4] truncate max-w-[120px]">
                          {member.role}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
