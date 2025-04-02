
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

const RepairsList = () => {
  return (
    <div>
      <h2>Repairs List</h2>
      <p>This is a placeholder for the repairs list view that shows repairs the user has helped with.</p>
    </div>
  );
};

const RepairDetail = () => {
  return (
    <div>
      <h2>Repair Detail</h2>
      <p>This is a placeholder for the repair detail view.</p>
    </div>
  );
};

const Repairs = () => {
  return (
    <Routes>
      <Route path="/" element={<RepairsList />} />
      <Route path="/:repairId" element={<RepairDetail />} />
    </Routes>
  );
};

export default Repairs;
