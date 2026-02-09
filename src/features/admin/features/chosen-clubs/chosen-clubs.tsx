// "use client";

// import { useAdminSocket } from "../../providers/admin-socket-provider";
// import { useEffect, useState } from "react";
// import { parse } from "@/core/lib/utils";
// import backgroundImg from '@public/assets/images/background_Img.png';

// export default function ChosenClubs() {

//     const { socket } = useAdminSocket()




//     return (
//         <div
//             className="w-full h-screen bg-cover bg-center flex flex-col items-center justify-center gap-12 text-white"
//             style={{ backgroundImage: `url(${backgroundImg.src})` }}
//         >
//             <h1 className="text-6xl font-black text-amber-400 drop-shadow-2xl italic tracking-tighter">
//                 CHOSEN CLUBS
//             </h1>

//             <div className="flex items-center justify-center gap-24 w-full px-20">
//                 <div className="flex flex-col items-center gap-6 group scale-110">
//                     <div className="relative">
//                         <div className="absolute -inset-4 bg-amber-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
//                         <div className="relative w-64 h-64 bg-white/10 backdrop-blur-md rounded-3xl border-2 border-amber-400/30 p-8 flex items-center justify-center shadow-2xl overflow-hidden">
//                             {clubs?.team1 ? (
//                                 <img
//                                     src={clubs.team1.img_url}
//                                     alt={clubs.team1.name}
//                                     width={180}
//                                     height={180}
//                                     className="object-contain"
//                                 />
//                             ) : (
//                                 <div className="text-white/20 text-8xl font-black uppercase italic -rotate-12 select-none">
//                                     A
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                     <div className="text-center">
//                         <p className="text-amber-400 text-sm font-bold tracking-widest uppercase mb-1">Team (A)</p>
//                         <h2 className="text-4xl font-black italic uppercase">{clubs?.team1?.name || "no Club Choosed"}</h2>
//                     </div>
//                 </div>

//                 {/* VS Divider */}
//                 <div className="flex flex-col items-center">
//                     <div className="w-px h-32 bg-linear-to-b from-transparent via-amber-400 to-transparent opacity-50" />
//                     <span className="text-6xl font-black text-white/20 italic my-4">VS</span>
//                     <div className="w-px h-32 bg-linear-to-b from-transparent via-amber-400 to-transparent opacity-50" />
//                 </div>

//                 {/* Team 2 Club */}
//                 <div className="flex flex-col items-center gap-6 group scale-110">
//                     <div className="relative">
//                         <div className="absolute -inset-4 bg-amber-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
//                         <div className="relative w-64 h-64 bg-white/10 backdrop-blur-md rounded-3xl border-2 border-amber-400/30 p-8 flex items-center justify-center shadow-2xl overflow-hidden">
//                             {clubs?.team2?.img_url ? (
//                                 <img
//                                     src={clubs.team2.img_url}
//                                     alt={clubs.team2.name}
//                                     width={180}
//                                     height={180}
//                                     className="object-contain"
//                                 />
//                             ) : (
//                                 <div className="text-white/20 text-8xl font-black uppercase italic -rotate-12 select-none">
//                                     B
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                     <div className="text-center">
//                         <p className="text-amber-400 text-sm font-bold tracking-widest uppercase mb-1">Team (B)</p>
//                         <h2 className="text-4xl font-black italic uppercase">{clubs?.team2?.name || "no Club Choosed"}</h2>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
