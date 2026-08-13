import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/gamification/leaderboard');
                if (response.data.success) {
                    setLeaderboard(response.data.leaderboard);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
                toast.error("Failed to load leaderboard");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24 md:pb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl -z-10 mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-3xl -z-10 mix-blend-screen" />
            
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4 pt-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="text-purple-300 font-medium">Global Rankings</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 tracking-tight">
                        Productivity Leaderboard
                    </h1>
                    <p className="text-zinc-400 max-w-lg mx-auto text-lg">
                        Complete tasks and maintain habits to earn XP, level up, and climb the ranks.
                    </p>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
                    {leaderboard.length === 0 ? (
                        <div className="text-center py-20">
                            <Award className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-zinc-300">No rankings yet</h3>
                            <p className="text-zinc-500 mt-2">Be the first to complete a task and earn XP!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {leaderboard.map((user, index) => (
                                <div 
                                    key={user._id} 
                                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.01] ${
                                        index < 3 
                                        ? 'bg-gradient-to-r from-purple-900/40 to-blue-900/20 border border-purple-500/30' 
                                        : 'bg-zinc-800/30 border border-white/5 hover:border-white/10'
                                    }`}
                                >
                                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-lg ${
                                        index === 0 ? 'bg-yellow-400 text-black' :
                                        index === 1 ? 'bg-zinc-300 text-black' :
                                        index === 2 ? 'bg-amber-600 text-white' :
                                        'bg-zinc-800 text-zinc-400'
                                    }`}>
                                        #{index + 1}
                                    </div>
                                    
                                    <div className="w-12 h-12 rounded-xl bg-zinc-800 overflow-hidden flex-shrink-0 border border-white/10">
                                        {user.profile_picture ? (
                                            <img src={user.profile_picture} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-purple-900/30 text-purple-300 font-bold text-xl">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-lg truncate flex items-center gap-2">
                                            {user.name}
                                            {index === 0 && <Medal className="w-4 h-4 text-yellow-400" />}
                                        </h3>
                                        <p className="text-sm text-zinc-400 truncate">@{user.username}</p>
                                    </div>
                                    
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                            {user.xp || 0} <span className="text-sm text-zinc-500 font-medium">XP</span>
                                        </div>
                                        <div className="text-xs font-semibold text-purple-300 bg-purple-500/10 px-2 py-1 rounded-md inline-block mt-1">
                                            Level {user.level || 1}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
