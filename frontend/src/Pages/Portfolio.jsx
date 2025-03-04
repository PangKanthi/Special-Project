import React, { useState, useEffect } from 'react';
import 'primeflex/primeflex.css';
import { Card } from 'primereact/card';
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const Portfolio = () => {
  const [search, setSearch] = useState('');
  const [workSamples, setWorkSamples] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const itemsPerPage = 8;

  const [selectedWork, setSelectedWork] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    const fetchWorkSamples = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch('http://localhost:1234/api/work-samples');
        if (!res.ok) {
          throw new Error('Failed to fetch work samples');
        }
        const data = await res.json();
        setWorkSamples(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkSamples();
  }, []);

  const filteredData = workSamples.filter((ws) =>
    ws.title.toLowerCase().includes(search.toLowerCase())
  );

  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleCardClick = (work) => {
    setSelectedWork(work);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setSelectedWork(null);
    setDialogVisible(false);
  };

  if (isLoading) {
    return <div className="text-center p-mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-mt-5">Error: {error}</div>;
  }

  return (
    <div className="pl-8 pr-8 mt-8">
      <div style={{ textAlign: 'center' }}>
        <h1>ผลงานของเรา</h1>
      </div>

      <div className="flex justify-content-end mt-4" style={{ paddingRight: '2rem' }}>
        <div
          className="flex"
          style={{
            width: '400px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '1px',
            borderRadius: '25px',
          }}
        >
          <InputText
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="ค้นหา"
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              paddingLeft: '10px',
              borderRadius: '25px 0 0 25px',
            }}
          />
          <Button
            icon="pi pi-search"
            className="p-button-secondary"
            style={{
              borderRadius: '0px 25px 25px 0px',
              backgroundColor: '#0a74da',
              border: 'none',
              width: '40px',
              height: '40px',
            }}
          />
        </div>
      </div>

      <div
        className="flex gap-4 justify-content-center flex-wrap pt-4"
        style={{ flex: 1 }}
      >
        {paginatedData.map((item) => {
          const firstImage =
            item.images && item.images.length > 0
              ? `http://localhost:1234${item.images[0]}`
              : 'https://via.placeholder.com/300';

          return (
            <div
              key={item.id}
              style={{ width: '325px', cursor: 'pointer' }}
              onClick={() => handleCardClick(item)}
            >
              <Card
                title={item.title}
                subTitle={item.description}
                header={
                  <img
                    alt={item.title}
                    src={firstImage}
                    style={{
                      width: '100%',
                      height: '325px',
                      borderRadius: '10px',
                      objectFit: 'cover',
                    }}
                  />
                }
                className="m-2 p-shadow-5"
              />
            </div>
          );
        })}
      </div>

      <Paginator
        first={startIndex}
        rows={itemsPerPage}
        totalRecords={filteredData.length}
        onPageChange={(e) => setPage(e.page)}
        className="mt-4"
      />

      <Dialog
        visible={dialogVisible}
        onHide={hideDialog}
        header={selectedWork ? selectedWork.title : 'รายละเอียดผลงาน'}
        style={{ width: '60vw', minHeight: '40vh' }}
      >
        {selectedWork && (
          <div className="p-3">
            <p style={{ marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>
              {selectedWork.description}
            </p>

            <div className="flex flex-wrap gap-3">
              {selectedWork.images.slice(0, 5).map((imgPath, index) => (
                <img
                  key={index}
                  src={`http://localhost:1234${imgPath}`}
                  alt={`img-${index}`}
                  style={{
                    width: '230px',
                    height: '230px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Portfolio;
