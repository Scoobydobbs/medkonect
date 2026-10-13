'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PharmacyOrder } from '@/lib/types';
import {
  Pill,
  Building2,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  PlusCircle,
  MapPin,
  ShoppingBag,
  Send,
  AlertCircle,
} from 'lucide-react';

export default function PharmacyPage() {
  const { pharmacies, orders, updateOrderStatus, createPharmacyOrder, hospitals } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'b2b_restock' | 'directory'>('orders');
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string>(pharmacies[0].id);

  // New B2B Restock Order form state
  const [b2bHospitalId, setB2bHospitalId] = useState<string>(hospitals[0].id);
  const [b2bItemName, setB2bItemName] = useState<string>('Noradrenaline 4mg Injection (Pack of 10)');
  const [b2bQty, setB2bQty] = useState<number>(20);
  const [b2bUnitPrice, setB2bUnitPrice] = useState<number>(850);

  const currentPharmacy = pharmacies.find((p) => p.id === selectedPharmacyId) || pharmacies[0];

  const handleCreateB2BOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const targetHospital = hospitals.find((h) => h.id === b2bHospitalId) || hospitals[0];

    createPharmacyOrder({
      pharmacyId: currentPharmacy.id,
      pharmacyName: currentPharmacy.name,
      orderType: 'HOSPITAL_B2B_RESTOCK',
      orderedBy: `${targetHospital.name} (ICU Pharmacy Stores)`,
      destinationHospitalOrPatient: `${targetHospital.name}, ${targetHospital.city}`,
      items: [
        {
          name: b2bItemName,
          quantity: Number(b2bQty),
          unitPriceInr: Number(b2bUnitPrice),
        },
      ],
      totalInr: Number(b2bQty) * Number(b2bUnitPrice),
    });

    alert(`B2B Restock order for ₹${(Number(b2bQty) * Number(b2bUnitPrice)).toLocaleString('en-IN')} placed with ${currentPharmacy.name}!`);
    setActiveTab('orders');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold text-xs uppercase tracking-wider">
            <Pill className="w-4 h-4" />
            <span>Healthcare Medicine Supply Chain</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Registered Pharmacy & Medicine Procurement Network
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            B2B hospital emergency medicine restocking & patient e-prescription fulfillment.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'orders'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Live Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('b2b_restock')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'b2b_restock'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Hospital Bulk Restock
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'directory'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Pharmacy Directory
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-600" />
              <span>Medicine Dispatch & Fulfillment Pipeline</span>
            </h2>
            <span className="text-xs text-slate-400">Real-time status updates</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                        {order.orderType === 'HOSPITAL_B2B_RESTOCK' ? 'Hospital B2B Bulk' : 'Patient E-Prescription'}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {order.pharmacyName}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                      Ordered By: {order.orderedBy}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{order.destinationHospitalOrPatient}</span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                      ₹{order.totalInr.toLocaleString('en-IN')}
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 ${
                        order.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : order.status === 'DISPATCHED'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : order.status === 'ACCEPTED'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-slate-800 dark:text-slate-200 font-medium">
                        {it.name} <span className="text-slate-400">× {it.quantity}</span>
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 font-bold">
                        ₹{(it.quantity * it.unitPriceInr).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Status action buttons */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Ordered: {new Date(order.orderedAt).toLocaleTimeString()}
                  </span>

                  <div className="flex items-center gap-2">
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ACCEPTED')}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-semibold text-xs"
                      >
                        Accept Order
                      </button>
                    )}
                    {order.status === 'ACCEPTED' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'DISPATCHED')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        Dispatch Delivery
                      </button>
                    )}
                    {order.status === 'DISPATCHED' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Confirm Delivery
                      </button>
                    )}
                    {order.status === 'DELIVERED' && (
                      <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed & Logged
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'b2b_restock' ? (
        /* Hospital Bulk Restock Order Form */
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 max-w-2xl">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-600" />
              <span>Hospital B2B Medicine & Supply Procurement</span>
            </h2>
            <p className="text-xs text-slate-500">
              Affiliated hospitals and clinics can issue direct bulk replenishment orders to licensed stockists and partner pharmacies.
            </p>
          </div>

          <form onSubmit={handleCreateB2BOrder} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Select Ordering Hospital
                </label>
                <select
                  value={b2bHospitalId}
                  onChange={(e) => setB2bHospitalId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Fulfilling Registered Pharmacy
                </label>
                <select
                  value={selectedPharmacyId}
                  onChange={(e) => setSelectedPharmacyId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                >
                  {pharmacies.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Bulk Medicine / Supply Item
              </label>
              <input
                type="text"
                value={b2bItemName}
                onChange={(e) => setB2bItemName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Quantity (Units/Packs)
                </label>
                <input
                  type="number"
                  value={b2bQty}
                  onChange={(e) => setB2bQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                  min={1}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Unit Price (₹ INR)
                </label>
                <input
                  type="number"
                  value={b2bUnitPrice}
                  onChange={(e) => setB2bUnitPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium"
                  min={1}
                  required
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 flex items-center justify-between font-semibold">
              <span className="text-cyan-900 dark:text-cyan-200">Total Purchase Value:</span>
              <span className="text-base font-extrabold text-cyan-900 dark:text-cyan-200">
                ₹{(b2bQty * b2bUnitPrice).toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Dispatch Purchase Order to Pharmacy
            </button>
          </form>
        </div>
      ) : (
        /* Pharmacy Directory */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pharmacies.map((pharma) => (
            <div
              key={pharma.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  Licensed Partner
                </span>
                <span className="text-xs text-slate-400">{pharma.city}</span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white">{pharma.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{pharma.address}</p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                <div>
                  <strong>License No:</strong> {pharma.licenseNumber}
                </div>
                <div>
                  <strong>Owner / Reg Pharmacist:</strong> {pharma.ownerName}
                </div>
                <div>
                  <strong>Contact:</strong> {pharma.phone}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
