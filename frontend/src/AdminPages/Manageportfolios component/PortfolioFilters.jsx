import React from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';

const PortfolioFilters = ({ onAdd }) => {
    return (
        <div className="p-4 mb-4 flex flex-wrap items-center gap-3 bg-white shadow-md rounded-lg">
            <div className="flex items-center gap-3 flex-wrap flex-grow">
                <Calendar value={new Date()} showIcon className="w-full flex-1" />
                <Button icon="pi pi-refresh" label="Reset Filter" className="p-button-danger p-button-outlined min-w-[150px] flex-1" />
            </div>
            <div className="flex gap-3 items-center ml-auto w-full md:w-auto">
                <div className="w-full md:w-72">
                    <span className="p-input-icon-left w-full flex items-center">
                        <i className="pi pi-search pl-3 text-gray-500" />
                        <InputText placeholder="Search Work" className="w-full pl-8" />
                    </span>
                </div>
                <div className="w-full md:w-72">
                    <Button label="Add New Work" icon="pi pi-plus" className="p-button-primary w-full md:w-auto" onClick={onAdd} />
                </div>
            </div>
        </div>
    );
};

export default PortfolioFilters;
