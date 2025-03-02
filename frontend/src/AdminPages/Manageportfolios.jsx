import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import PortfolioFilters from './Manageportfolios component/PortfolioFilters';
import PortfolioList from './Manageportfolios component/PortfolioList';
import PortfolioDialog from './Manageportfolios component/PortfolioDialog';
import axios from 'axios';

const ManagePortfolios = () => {
    const [visible, setVisible] = useState(false);
    const [portfolios, setPortfolios] = useState([]);

    useEffect(() => {
        fetchWorkSamples();
    }, []);

    const fetchWorkSamples = async () => {
        try {
            const response = await axios.get("/api/work-samples");
            setPortfolios(response.data);
        } catch (error) {
            console.error("Error fetching work samples:", error);
        }
    };

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
            <PortfolioFilters onAdd={() => setVisible(true)} />

            <PortfolioList portfolios={portfolios} />

            <div className="flex justify-between items-center mt-6">
                <div className="mt-4">
                    <span>Showing {portfolios.length} works</span>
                </div>
                <Paginator rows={8} totalRecords={portfolios.length} />
            </div>

            <PortfolioDialog visible={visible} onClose={() => setVisible(false)} onWorkSampleAdded={fetchWorkSamples} />
        </div>
    );
};

export default ManagePortfolios;
