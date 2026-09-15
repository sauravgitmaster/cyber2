import React, { useState, useEffect } from 'react';
import { RoomStateClient } from '../../types/multiplayer';
import { CheckCircle2, XCircle, Sparkles, Shield, Clock } from 'lucide-react';
import { ByteMascot } from '../common/ByteMascot';

interface MultiplayerQuestionProps {
  room: RoomStateClient;
  currentUserId: string;
  onSelectOption: (questionId: string, optionId: string) => void;
}

export const MultiplayerQuestion: React.FC<MultiplayerQuestionProps> = ({
  room,
  currentUserId,
  onSelectOption,
}) => {
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);

  const question = room.currentQuestion;
  const isLocked = room.status === 'round_locked';
  const result = room.lastRoundResult;

  // Reset selected state when a new question arrives
  useEffect(() => {
    setSelectedOptId(null);
  }, [question?.id]);

  if (!question) {
    return null;
  }

  const handleOptionClick = (optionId: string) => {
    if (selectedOptId || isLocked || room.status !== 'in_round') return;
    setSelectedOptId(optionId);
    onSelectOption(question.id, optionId);
  };

  const isHost = room.host.id === currentUserId;
  const myName = isHost ? room.host.name : room.guest?.name || 'You';
  const isMyWin = result?.winnerPlayerId === currentUserId;
  const friendName = isHost ? room.guest?.name || 'Friend' : room.host.name;
  const isFriendWin = result?.winnerPlayerId && result.winnerPlayerId !== currentUserId;

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Question Situation Card */}
      <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black text-[#4F7CFF] uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            {question.category}
          </span>
          <span className="text-xs font-bold text-slate-400">{question.difficulty}</span>
        </div>

        <p className="text-sm sm:text-base font-semibold text-[#243047] leading-relaxed">
          {question.situation}
        </p>

        <div className="pt-1 flex items-center gap-1.5 text-xs font-black text-slate-700">
          <span>{question.prompt}</span>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-1 gap-2.5">
        {question.options.map((opt, index) => {
          const isSelected = selectedOptId === opt.id;
          const isCorrectAnswer = isLocked && result?.correctOptionId === opt.id;
          const isMyWrongAnswer = isLocked && isSelected && !isCorrectAnswer;

          let btnStyles =
            'bg-white border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-slate-700';

          if (isSelected && !isLocked) {
            btnStyles = 'bg-blue-50 border-2 border-[#4F7CFF] text-[#243047] font-bold shadow-2xs';
          } else if (isCorrectAnswer) {
            btnStyles = 'bg-emerald-50 border-2 border-emerald-400 text-emerald-900 font-bold';
          } else if (isMyWrongAnswer) {
            btnStyles = 'bg-slate-50 border-2 border-slate-300 text-slate-400 opacity-60';
          } else if (isLocked) {
            btnStyles = 'bg-white border-2 border-slate-100 text-slate-400 opacity-50';
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleOptionClick(opt.id)}
              disabled={Boolean(selectedOptId) || isLocked}
              className={`w-full p-3.5 sm:p-4 rounded-2xl text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 active:scale-99 ${btnStyles}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-black text-xs flex items-center justify-center shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-medium text-[#243047]">{opt.text}</span>
              </div>

              {isCorrectAnswer && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Round Lock / Winner Announcement Banner */}
      {isLocked && result && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 text-center space-y-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-center gap-2">
            {isMyWin ? (
              <>
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-black text-emerald-700">
                  🎉 You got it first! +100 ⭐
                </span>
              </>
            ) : isFriendWin ? (
              <>
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-black text-[#243047]">
                  🎉 {friendName} got it first! +100 ⭐
                </span>
              </>
            ) : (
              <span className="text-sm font-black text-slate-600">
                ⏰ Round Complete!
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
            💡 <strong className="text-[#243047]">Byte’s Trick Note:</strong> {result.whySafe}
          </p>
        </div>
      )}
    </div>
  );
};
