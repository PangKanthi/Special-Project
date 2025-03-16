import React, { useState, useEffect } from 'react';
import { Paginator } from 'primereact/paginator';
import PortfolioFilters from './Manageportfolios component/PortfolioFilters';
import PortfolioList from './Manageportfolios component/PortfolioList';
import PortfolioDialog from './Manageportfolios component/PortfolioDialog';

const API_URL = "https://api.d-dayengineering.com/api/work-samples";

const ManagePortfolios = () => {
    const [visible, setVisible] = useState(false);
    const [portfolios, setPortfolios] = useState([]);
    const [selectedPortfolio, setSelectedPortfolio] = useState(null);
    const [first, setFirst] = useState(0);
    const rowsPerPage = 8;

    useEffect(() => {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => setPortfolios(data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    const fetchPortfolios = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setPortfolios(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleAddWorkSample = async (newWorkSample) => {
        try {
            const formData = new FormData();
            formData.append("title", newWorkSample.title);
            formData.append("description", newWorkSample.description);
            newWorkSample.images.forEach(file => {
                formData.append("images", file);
            });

            const token = localStorage.getItem("token");
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData
            });

            const createdWorkSample = await response.json();
            setPortfolios([...portfolios, createdWorkSample]);
            fetchPortfolios();
        } catch (error) {
            console.error("Error adding work sample:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            setPortfolios(portfolios.filter(item => item.id !== id));
        } catch (error) {
            console.error("Error deleting work sample:", error);
        }
    };

    const handleEdit = (portfolio) => {
        setSelectedPortfolio(portfolio);
        setVisible(true);
    };

    const handleUpdate = async (updatedPortfolio) => {
        try {
            const formData = new FormData();
            formData.append("title", updatedPortfolio.title);
            formData.append("description", updatedPortfolio.description);
            
            if (updatedPortfolio.images) {
                updatedPortfolio.images.forEach(file => {
                    if (file instanceof File) {
                        formData.append("images", file);
                    }
                });
            }

            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/${updatedPortfolio.id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            const updatedWorkSample = await response.json();
            setPortfolios(portfolios.map(item => (item.id === updatedWorkSample.id ? updatedWorkSample : item)));
        } catch (error) {
            console.error("Error updating work sample:", error);
        }
    };

    const onPageChange = (event) => {
        setFirst(event.first);
    };

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold mb-4">การจัดการผลงาน</h2>

            <PortfolioFilters onAdd={() => { setSelectedPortfolio(null); setVisible(true); }} />

            <PortfolioList
                portfolios={portfolios.slice(first, first + rowsPerPage)}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />

            <div className="flex justify-between items-center mt-6">
                <span>Showing {first + 1} - {Math.min(first + rowsPerPage, portfolios.length)} of {portfolios.length}</span>
                <Paginator
                    first={first}
                    rows={rowsPerPage}
                    totalRecords={portfolios.length}
                    onPageChange={onPageChange}
                />
            </div>

            <PortfolioDialog
                key={selectedPortfolio?.id || "new"}
                visible={visible}
                onClose={() => setVisible(false)}
                onWorkSampleAdded={handleAddWorkSample}
                fetchPortfolios={fetchPortfolios}
                onUpdate={handleUpdate}
                selectedPortfolio={selectedPortfolio}
            />
        </div>
    );
};

export default ManagePortfolios;
