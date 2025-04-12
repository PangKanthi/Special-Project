import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

const API_URL = `${process.env.REACT_APP_API}/api/reviews`;

const Managereview = () => {
    const [reviews, setReviews] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState(null);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setReviews(data.data || []);

                // ดึง user ไม่ซ้ำ
                const uniqueUsers = [...new Map(data.data.map((r) => [r.user.id, r.user])).values()];
                setUsers(uniqueUsers);
            } else {
                console.error('Error:', data.message || 'ไม่สามารถโหลดรีวิวได้');
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (id) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setReviews(reviews.filter((r) => r.id !== id));
                setConfirmDialogVisible(false);
            } else {
                alert(data.error || 'เกิดข้อผิดพลาดในการลบรีวิว');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const confirmDelete = (review) => {
        setSelectedReview(review);
        setConfirmDialogVisible(true);
    };

    const filteredReviews = reviews.filter((r) => {
        const matchUser = selectedUserId ? r.user.id === selectedUserId : true;
        const keyword = searchKeyword.toLowerCase();
        const fullName = `${r.user.firstname} ${r.user.lastname}`.toLowerCase();
        const matchSearch =
            r.product.name.toLowerCase().includes(keyword) ||
            r.content.toLowerCase().includes(keyword) ||
            fullName.includes(keyword);
        return matchUser && matchSearch;
    });


    return (
        <div className="p-8">
            <div className="mb-4 flex items-center justify-content-between flex-wrap">
                <h2 className="text-xl font-bold">การจัดการรีวิว</h2>

                <div className="flex gap-2 mt-3" style={{ width: '100%', maxWidth: '500px', height: "38px" }}>
                    <span className="p-input-icon-left">
                        <i className="pi pi-search pl-3 text-gray-500" />
                        <InputText
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            placeholder="ค้นหาชื่อ/สินค้า/รีวิว"
                            className="w-full pl-6"
                        />
                    </span>

                    <Dropdown
                        value={selectedUserId}
                        options={users.map((u) => ({
                            label: `${u.firstname} ${u.lastname}`,
                            value: u.id,
                        }))}
                        onChange={(e) => setSelectedUserId(e.value)}
                        placeholder="เลือกผู้ใช้"
                        showClear
                    />
                </div>
            </div>


            <DataTable
                value={filteredReviews}
                loading={loading}
                paginator
                rows={10}
                emptyMessage="ไม่มีรีวิว"
            >
                <Column
                    field="user.firstname"
                    header="ชื่อผู้ใช้"
                    body={(rowData) => `${rowData.user.firstname} ${rowData.user.lastname}`}
                />
                <Column field="product.name" header="ชื่อสินค้า" />
                <Column
                    field="rating"
                    header="คะแนน"
                    body={(rowData) => <Tag value={rowData.rating} severity="info" />}
                />
                <Column field="content" header="ข้อความรีวิว" />
                <Column
                    header="การจัดการ"
                    body={(rowData) => (
                        <Button
                            icon="pi pi-trash"
                            className="p-button-danger p-button-sm"
                            onClick={() => confirmDelete(rowData)}
                        />
                    )}
                />
            </DataTable>

            <Dialog
                header="ยืนยันการลบ"
                visible={confirmDialogVisible}
                onHide={() => setConfirmDialogVisible(false)}
                footer={
                    <>
                        <Button
                            label="ยกเลิก"
                            className="p-button-text"
                            onClick={() => setConfirmDialogVisible(false)}
                        />
                        <Button
                            label="ลบ"
                            className="p-button-danger"
                            onClick={() => handleDeleteReview(selectedReview.id)}
                        />
                    </>
                }
            >
                <p>
                    คุณแน่ใจว่าต้องการลบรีวิวของ{' '}
                    <strong>{selectedReview?.user?.firstname}</strong> ใช่หรือไม่?
                </p>
            </Dialog>
        </div>
    );
};

export default Managereview;