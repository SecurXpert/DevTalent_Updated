"use client";

import React, { useState } from "react";
import { Pencil, Trash2, BookOpen, CheckSquare, Code, Save, X } from "lucide-react";
import { BASE_URL } from "../../lib/api";

type PlanItem = {
  id: number;
  name: string;
  planType: string;
  courseLimit: number;
  mcqCredits: number;
  codingCredits: number;
  amount: number;
  gst_percent?: number;
  description?: string;
  is_active?: boolean;
};

type Props = {
  plans: PlanItem[];
  onEdit: (plan: PlanItem) => void;
  onDelete: (id: number) => void;
  onUpdate?: (plan: PlanItem) => void; // New optional prop to handle update success
};

const PlansTable: React.FC<Props> = ({ plans, onEdit, onDelete, onUpdate }) => {
  const [inlineEditingId, setInlineEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<PlanItem>>({});
  const [isSaving, setIsSaving] = useState(false);

  const calculateGST = (amount: number, gstPercent: number = 18) => {
    const total = amount + amount * (gstPercent / 100);
    return total.toFixed(2);
  };

  const startInlineEdit = (plan: PlanItem) => {
    setInlineEditingId(plan.id);
    setEditForm(plan);
  };

  const cancelInlineEdit = () => {
    setInlineEditingId(null);
    setEditForm({});
  };

  const handleInputChange = (field: keyof PlanItem, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const saveInlineEdit = async (id: number) => {
    setIsSaving(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }

      const requestBody = {
        plan_name: editForm.name,
        plan_type: editForm.planType,
        course_limit: Number(editForm.courseLimit),
        mcq_credit_total: Number(editForm.mcqCredits),
        coding_credit_total: Number(editForm.codingCredits),
        amount: Number(editForm.amount),
        gst_percent: editForm.gst_percent || 18,
        is_active: editForm.is_active !== undefined ? editForm.is_active : true,
      };

      const response = await fetch(`${BASE_URL || 'http://192.168.0.103:8000'}/admin/catalog/plans/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const updatedPlanResponse = await response.json();
        const finalUpdatedPlan: PlanItem = {
          id: updatedPlanResponse.id || id,
          name: updatedPlanResponse.plan_name || requestBody.plan_name,
          planType: updatedPlanResponse.plan_type || requestBody.plan_type,
          courseLimit: updatedPlanResponse.course_limit || requestBody.course_limit,
          mcqCredits: updatedPlanResponse.mcq_credit_total || requestBody.mcq_credit_total,
          codingCredits: updatedPlanResponse.coding_credit_total || requestBody.coding_credit_total,
          amount: updatedPlanResponse.amount || requestBody.amount,
          gst_percent: updatedPlanResponse.gst_percent || requestBody.gst_percent,
          description: updatedPlanResponse.description || '',
          is_active: updatedPlanResponse.is_active !== undefined ? updatedPlanResponse.is_active : true,
        };

        if (onUpdate) {
          onUpdate(finalUpdatedPlan);
        }
        setInlineEditingId(null);
      } else {
        alert("Failed to update plan. Status: " + response.status);
      }
    } catch (error) {
      console.error("Error saving plan inline:", error);
      alert("Error saving plan");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        {/* Header */}
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-6 py-4 text-left">Plan Type</th>
            <th className="px-6 py-4 text-left">Plan Name</th>
            <th className="px-6 py-4 text-left">Course Limit</th>
            <th className="px-6 py-4 text-left">MCQ Credits</th>
            <th className="px-6 py-4 text-left">Coding Credits</th>
            <th className="px-6 py-4 text-left">Amount</th>
            <th className="px-6 py-4 text-left">Total (Incl. GST)</th>
            <th className="px-6 py-4 text-left">Actions</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="text-sm text-gray-700">
          {plans.map((plan) => {
            const isEditing = inlineEditingId === plan.id;
            return (
              <tr key={plan.id} className="border-t">
                {/* Plan Type */}
                <td className="px-6 py-5 font-medium">
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-500"
                      value={editForm.planType || ""}
                      onChange={(e) => handleInputChange('planType', e.target.value)}
                    />
                  ) : (
                    plan.planType
                  )}
                </td>

                {/* Plan Name */}
                <td className="px-6 py-5">
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-500"
                      value={editForm.name || ""}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  ) : (
                    plan.name
                  )}
                </td>

                {/* Course Limit */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-gray-400" />
                    {isEditing ? (
                      <input
                        type="number"
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-500"
                        value={editForm.courseLimit !== undefined ? editForm.courseLimit : ""}
                        onChange={(e) => handleInputChange('courseLimit', e.target.value)}
                      />
                    ) : (
                      plan.courseLimit
                    )}
                  </div>
                </td>

                {/* MCQ Credits */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <CheckSquare size={16} className="text-blue-500" />
                    {isEditing ? (
                      <input
                        type="number"
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-500"
                        value={editForm.mcqCredits !== undefined ? editForm.mcqCredits : ""}
                        onChange={(e) => handleInputChange('mcqCredits', e.target.value)}
                      />
                    ) : (
                      plan.mcqCredits
                    )}
                  </div>
                </td>

                {/* Coding Credits */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <Code size={16} className="text-purple-500" />
                    {isEditing ? (
                      <input
                        type="number"
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-500"
                        value={editForm.codingCredits !== undefined ? editForm.codingCredits : ""}
                        onChange={(e) => handleInputChange('codingCredits', e.target.value)}
                      />
                    ) : (
                      plan.codingCredits
                    )}
                  </div>
                </td>

                {/* Amount */}
                <td className="px-6 py-5 font-semibold text-green-600">
                  {isEditing ? (
                    <div className="flex items-center">
                      <span className="mr-1">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        className="w-24 border border-gray-300 rounded px-2 py-1 text-sm font-normal text-black focus:outline-none focus:border-indigo-500"
                        value={editForm.amount !== undefined ? editForm.amount : ""}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                      />
                    </div>
                  ) : (
                    `₹ ${plan.amount.toFixed(2)}`
                  )}
                </td>

                {/* Total with GST */}
                <td className="px-6 py-5">
                  {isEditing ? (
                    <div className="text-sm text-gray-500">
                      Auto-calculated<br />(GST: {editForm.gst_percent || 18}%)
                    </div>
                  ) : (
                    <>
                      <div className="text-indigo-600 font-semibold">
                        ₹ {calculateGST(plan.amount, plan.gst_percent)}
                      </div>
                      <div className="text-xs text-gray-500">GST: {plan.gst_percent || 18}%</div>
                    </>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-5">
                  {isEditing ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => saveInlineEdit(plan.id)}
                        disabled={isSaving}
                        className="text-green-600 hover:text-green-800 disabled:opacity-50"
                        title="Save"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={cancelInlineEdit}
                        disabled={isSaving}
                        className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <button
                        onClick={() => startInlineEdit(plan)}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="Edit Inline"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(plan.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PlansTable;
