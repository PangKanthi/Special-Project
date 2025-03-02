import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const PortfolioList = ({ portfolios }) => {
    return (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            {portfolios.map((portfolio, index) => (
                <Card key={index} className="shadow-md">
                    <div className="h-40 bg-gray-300 mb-3"></div>
                    <h5 className="font-bold text-center">{portfolio.title}</h5>
                    <p className="text-center text-sm text-gray-500">{portfolio.description}</p>
                    <div className="flex justify-content-center gap-2 mt-3">
                        <Button icon="pi pi-pencil" className="p-button-text" />
                        <Button icon="pi pi-trash" className="p-button-text p-button-danger" />
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default PortfolioList;
