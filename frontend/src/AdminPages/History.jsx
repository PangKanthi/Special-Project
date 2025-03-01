import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const History = () => {
  const [filters, setFilters] = useState({ date: null, orderType: null, orderStatus: null });
  const [search, setSearch] = useState('');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const orderTypes = ['ซ่อม', 'ติดตั้ง', 'เช็ครายปี'];
  const orderStatus = [
    { label: 'สำเร็จ', value: 'success' },
    { label: 'ยกเลิก', value: 'canceled' }
  ];

  const orders = [
    { id: '00001', name: 'Christine Brooks', address: '089 Kutch Green Apt. 448', date: '04 Sep 2019', type: 'ซ่อม', status: 'success' },
    { id: '00002', name: 'Rosie Pearson', address: '979 Immanuel Ferry Suite 526', date: '28 May 2019', type: 'ติดตั้ง', status: 'success' },
    { id: '00003', name: 'Darrell Caldwell', address: '8587 Frida Ports', date: '23 Nov 2019', type: 'เช็ครายปี', status: 'canceled' },
  ];

  const statusTemplate = (rowData) => (
    <Tag severity={rowData.status === 'success' ? 'success' : 'danger'} value={rowData.status === 'success' ? 'สำเร็จ' : 'ยกเลิก'} />
  );

  const actionTemplate = () => (
    <>
      <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary p-button-sm" />
      <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-sm" />
    </>
  );

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">History List</h2>
      <div className="p-4 mb-4 flex flex-wrap items-center gap-3 bg-white shadow-md rounded-lg">
        <div className="flex items-center gap-2 flex-wrap flex-grow">
          <Button icon="pi pi-filter" label="Filter By" className="p-button-outlined p-button-secondary" />
          <Calendar value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.value })} placeholder="Filter By Date" showIcon />
          <Dropdown value={filters.orderType} options={orderTypes} onChange={(e) => setFilters({ ...filters, orderType: e.value })} placeholder="Order Type" />
          <Dropdown value={filters.orderStatus} options={orderStatus} onChange={(e) => setFilters({ ...filters, orderStatus: e.value })} placeholder="Order Status" optionLabel="label" optionValue="value" />
          <Button icon="pi pi-refresh" label="Reset Filter" className="p-button-danger p-button-outlined" onClick={() => setFilters({ date: null, orderType: null, orderStatus: null })} />
        </div>
        <div className="ml-auto w-72">
          <span className="p-input-icon-left w-full flex items-center">
            <i className="pi pi-search pl-3 text-gray-500" />
            <InputText value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search History" className="w-full pl-8" />
          </span>
        </div>
      </div>

      <DataTable value={orders} paginator rows={rows} first={first} onPage={(e) => { setFirst(e.first); setRows(e.rows); }} responsiveLayout="scroll">
        <Column field="id" header="ID" />
        <Column field="name" header="Name" />
        <Column field="address" header="Address" />
        <Column field="date" header="Date" />
        <Column field="type" header="Type" />
        <Column field="status" header="Status" body={statusTemplate} />
        <Column header="Action" body={actionTemplate} />
      </DataTable>
    </div>
  );
};

export default History;
