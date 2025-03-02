import React, { useState } from 'react';
import { Paginator } from 'primereact/paginator';
import PortfolioFilters from './Manageportfolios component/PortfolioFilters';
import PortfolioList from './Manageportfolios component/PortfolioList';
import PortfolioDialog from './Manageportfolios component/PortfolioDialog';

const ManagePortfolios = () => {
    const [visible, setVisible] = useState(false);
    const [portfolios, setPortfolios] = useState([]);
    const [selectedPortfolio, setSelectedPortfolio] = useState(null);
    const [first, setFirst] = useState(0); // ✅ ใช้กำหนด index ของรายการแรกที่แสดง
    const rowsPerPage = 8; // ✅ กำหนดให้แสดง 8 รายการต่อหน้า

    // ✅ เพิ่มข้อมูลใหม่
    const handleAddWorkSample = (newWorkSample) => {
        setPortfolios([...portfolios, newWorkSample]);
    };

    // ✅ ลบข้อมูล
    const handleDelete = (id) => {
        setPortfolios(portfolios.filter(item => item.id !== id));
    };

    // ✅ แก้ไขข้อมูล
    const handleEdit = (portfolio) => {
        setSelectedPortfolio(portfolio);
        setVisible(true);
    };

    // ✅ อัปเดตข้อมูล
    const handleUpdate = (updatedPortfolio) => {
        setPortfolios(portfolios.map(item => item.id === updatedPortfolio.id ? updatedPortfolio : item));
    };

    // ✅ เปลี่ยนหน้าของ Paginator
    const onPageChange = (event) => {
        setFirst(event.first);
    };

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
            <PortfolioFilters onAdd={() => { setSelectedPortfolio(null); setVisible(true); }} />

            {/* ✅ ส่งเฉพาะรายการที่ต้องแสดงไปให้ PortfolioList */}
            <PortfolioList portfolios={portfolios.slice(first, first + rowsPerPage)} onDelete={handleDelete} onEdit={handleEdit} />

            <div className="flex justify-content-between items-center mt-6">
                <div className="mt-4">
                    <span>Showing {first + 1} - {Math.min(first + rowsPerPage, portfolios.length)} of {portfolios.length}</span>
                </div>
                <Paginator first={first} rows={rowsPerPage} totalRecords={portfolios.length} onPageChange={onPageChange} />
            </div>

            <PortfolioDialog 
                visible={visible} 
                onClose={() => setVisible(false)} 
                onWorkSampleAdded={handleAddWorkSample} 
                onUpdate={handleUpdate} 
                selectedPortfolio={selectedPortfolio} 
            />
        </div>
    );
};

export default ManagePortfolios;
