// NotificationPanel.jsx
import { OverlayPanel } from 'primereact/overlaypanel';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotificationPanel({ notifications, setNotifications }) {
  const op = useRef(null);
  const navigate = useNavigate();

  // เมื่อคลิกแจ้งเตือน
  const handleNotificationClick = (notif) => {
    // ตัวอย่าง: ลบออกจาก state (หรือ mark as read)
    setNotifications((prev) => prev.filter(n => n.id !== notif.id));

    // นำทางไปยังหน้าที่เกี่ยวข้องตาม type
    switch (notif.type) {
      case 'repair':
        navigate('/managerepairrequests');
        break;
      case 'order':
        navigate('/manageorders');
        break;
      case 'product':
        navigate('/manageproducts');
        break;
      default:
        navigate('/homeadmin');
    }
  };

  return (
    <div className="relative inline-block">
      <Button
        icon="pi pi-bell"
        className="p-button-text text-white relative"
        onClick={(e) => op.current.toggle(e)}
      />

      {notifications.length > 0 && (
        <Badge
          value={notifications.length}
          severity="danger"
          className="absolute top-0 right-0"
        />
      )}

      <OverlayPanel
        ref={op}
        className="shadow-lg rounded-xl w-96 p-3 bg-white animate-fade-slide-down"
      >
        <div className="flex items-center gap-2 text-gray-800 font-bold text-xl mb-2">
          <i className="pi pi-bell text-blue-500"></i>
          การแจ้งเตือน
        </div>
        <hr className="my-2 border-gray-300" />

        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="p-3 flex items-center gap-3 hover:bg-blue-50 transition-all rounded-lg cursor-pointer"
              onClick={() => handleNotificationClick(notif)}
            >
              {notif.type === 'repair' && (
                <i className="pi pi-wrench text-2xl text-orange-500"></i>
              )}
              {notif.type === 'order' && (
                <i className="pi pi-shopping-cart text-2xl text-green-500"></i>
              )}
              {notif.type === 'product' && (
                <i className="pi pi-box text-2xl text-blue-500"></i>
              )}
              {!['repair', 'order', 'product'].includes(notif.type) && (
                <i className="pi pi-exclamation-circle text-2xl text-gray-500"></i>
              )}

              <div className="flex-1">
                <div className="font-medium text-gray-900">{notif.message}</div>
                <small className="text-gray-500">
                  {notif.time || 'Just now'}
                </small>
              </div>
            </div>
          ))
        ) : (
          <div className="p-3 text-center text-gray-500">
            ไม่มีการแจ้งเตือน
          </div>
        )}
      </OverlayPanel>
    </div>
  );
}
