import React from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Paginator } from 'primereact/paginator';
import { FilterIcon } from 'primereact/icons/filter';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import 'primeicons/primeicons.css';

const ManagePortfolios = () => {
    const portfolios = Array(8).fill({ title: 'XXXXXX', description: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXX' });

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
            <div className="p-4 mb-4 flex flex-wrap items-center gap-3 bg-white shadow-md rounded-lg">
                <div className="flex items-center gap-2 flex-wrap flex-grow">
                    <Button icon="pi pi-filter" label="Filter By" className="p-button-outlined p-button-secondary min-w-[120px]" />
                    <Calendar value={new Date()} showIcon className="w-40" />
                    <Dropdown value="Order Type" options={[]} placeholder="Order Type" className="w-40" />
                    <Button icon="pi pi-refresh" label="Reset Filter" className="p-button-danger p-button-outlined min-w-[120px]" />
                </div>
                <div className="flex space-x-4 items-center ml-auto">
                    <div className="ml-auto w-72 pt-3">
                        <span className="p-input-icon-left w-full flex items-center pr-3">
                            <i className="pi pi-search pl-3 text-gray-500" />
                            <InputText placeholder="Search Work" className="w-full pl-8" />
                        </span>
                    </div>
                    <div className="ml-auto w-72 pt-3">
                        <Button label="Add New Product" icon="pi pi-plus" className="p-button-primary" onClick={() => { }} />
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                {portfolios.map((portfolio, index) => (
                    <Card key={index} className="shadow-md">
                        <div className="h-40 bg-gray-300 mb-3"></div>
                        <h5 className="font-bold text-center">{portfolio.title}</h5>
                        <p className="text-center text-sm text-gray-500">{portfolio.description}</p>
                        <div className="flex justify-center gap-2 mt-3">
                            <Button icon="pi pi-pencil" className="p-button-text" />
                            <Button icon="pi pi-trash" className="p-button-text p-button-danger" />
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex justify-between items-center mt-4">
                <span>Showing 1-8 of 78</span>
                <Paginator rows={8} totalRecords={78} />
            </div>
        </div>
    );
};

export default ManagePortfolios;
