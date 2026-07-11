/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { useAppState } from "../../context/AppContext";
import { Bell, Check, Trash2, ShieldAlert } from "lucide-react";

export const Notifications: React.FC = () => {
  const { showToast } = useAppState();
  const [notifs, setNotifs] = useState<any[]>([]);

  const markAllAsRead = async () => {
    const updated = notifs.map((n: any) => ({ ...n, isRead: true }));
    setNotifs(updated);
    showToast("All notifications marked as read.", "success");
  };

  const deleteNotification = async (id: string) => {
    const updated = notifs.filter((n: any) => n.id !== id);
    setNotifs(updated);
    showToast("Notification removed.", "info");
  };

  const toggleReadStatus = async (id: string) => {
    const updated = notifs.map((n: any) => (n.id === id ? { ...n, isRead: !n.isRead } : n));
    setNotifs(updated);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6 text-xs text-slate-700" id="notifications-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
        <div className="space-y-1">
          <h2 className="text-md font-bold text-[#0B2A5B] flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-[#FF6B00]" />
            <span>Alert logs & updates</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">
            Monitor state updates, approval milestones, and system messages scoping your DPIIT profile.
          </p>
        </div>
        {notifs.some((n: any) => !n.isRead) && (
          <button
            onClick={markAllAsRead}
            className="text-xs font-bold text-[#0B2A5B] hover:underline flex items-center gap-1 self-start sm:self-auto"
            id="mark-all-read-btn"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <div className="text-center py-10 space-y-3">
          <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-slate-400 font-semibold">Your notifications tray is currently clear.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifs.map((item: any) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border transition-all flex justify-between gap-4 items-start ${
                item.isRead
                  ? "bg-slate-50/50 border-slate-150 text-slate-500"
                  : "bg-white border-[#0B2A5B]/20 shadow-xs text-slate-800"
              }`}
              id={`notif-${item.id}`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    item.type === "success" ? "bg-emerald-500" :
                    item.type === "warning" ? "bg-amber-500" :
                    item.type === "error" ? "bg-red-500" : "bg-blue-500"
                  }`}></span>
                  <h4 className="font-bold text-[#0B2A5B]">{item.title}</h4>
                </div>
                <p className="leading-relaxed font-semibold">{item.message}</p>
                <span className="text-[10px] text-slate-400 font-mono block">{item.timestamp}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-0.5">
                <button
                  onClick={() => toggleReadStatus(item.id)}
                  className="text-[10px] font-bold text-slate-500 hover:text-[#0B2A5B] underline"
                >
                  {item.isRead ? "Mark Unread" : "Mark Read"}
                </button>
                <button
                  onClick={() => deleteNotification(item.id)}
                  className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-red-650 transition-colors"
                  title="Delete notification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
