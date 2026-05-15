/** Một slide full viewport (100dvh); overflow-y-auto khi nội dung cao hơn màn — full-page kiểu okvipci */
export const fullLayout =
  'relative isolate h-dvh min-h-0 w-full max-w-full min-w-0 flex-none box-border flex flex-col items-center justify-center py-16 sm:py-20 px-4 sm:px-6 scroll-animate overflow-x-hidden overflow-y-auto overscroll-y-contain'

/** Giống fullLayout nhưng căn nội dung từ trên (phù hợp bảng dài / leaderboard) */
export const fullLayoutTop =
  'relative isolate h-dvh min-h-0 w-full max-w-full min-w-0 flex-none box-border flex flex-col items-center justify-start py-14 sm:py-16 px-4 sm:px-6 scroll-animate overflow-x-hidden overflow-y-auto overscroll-y-contain'
