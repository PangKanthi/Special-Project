import { OverlayPanel } from 'primereact/overlaypanel';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotificationPanel({ notifications, setNotifications }) {
    const op = useRef(null);
    const navigate = useNavigate();

    // ฟังก์ชันเมื่อกดแจ้งเตือน
    const handleNotificationClick = (notif) => {
        // ลบการแจ้งเตือนออกจาก state
        setNotifications((prev) => prev.filter(n => n.id !== notif.id));

        // นำทางไปยังหน้าเป้าหมาย
        if (notif.type === "repair") {
            navigate('/managerepairrequests');
        } else if (notif.type === "order") {
            navigate('/manageorders');
        } else {
            navigate('/homeadmin');
        }
    };

    return (
        <div className="relative">
            <Button icon="pi pi-bell" className="p-button-text text-white" onClick={(e) => op.current.toggle(e)} />
            <Badge
                value={notifications.length}
                severity="danger"
                className="absolute top-0 right-0"
            />
            {/* Popup แจ้งเตือนแบบใหม่ */}
            <OverlayPanel ref={op} className="shadow-lg rounded-xl w-80 p-3 bg-white animate-fade-slide-down">
                <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
                    <i className="pi pi-bell text-blue-500 pt-1"></i> การแจ้งเตือน
                </div>
                <hr className="my-2 border-gray-300" />

                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className="p-3 flex items-center gap-3 hover:bg-blue-50 transition-all rounded-lg cursor-pointer"
                            onClick={() => handleNotificationClick(notif)}
                        >
                            <i className="pi pi-exclamation-circle text-2xl text-red-500"></i>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">{notif.message}</div>
                                <small className="text-gray-500">{notif.time}</small>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-3 text-center text-gray-500">ไม่มีการแจ้งเตือน</div>
                )}
            </OverlayPanel>
        </div>
    );
}
