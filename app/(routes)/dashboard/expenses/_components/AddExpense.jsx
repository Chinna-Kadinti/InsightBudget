import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { Loader } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "sonner";

function AddExpense({ budgetId, user, refreshData }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Used to Add New Expense
   */
  const addNewExpense = async () => {
    setLoading(true);

    // Validate inputs
    if (!name.trim()) {
      toast.error("Expense name is required.");
      setLoading(false);
      return;
    }
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error("Expense amount must be a positive number.");
      setLoading(false);
      return;
    }

    try {
      const result = await db
        .insert(Expenses)
        .values({
          name: name.trim(),
          amount: parseFloat(amount),
          budgetId: budgetId,
          createdAt: moment().format("YYYY-MM-DD"),
        })
        .returning({ insertedId: Budgets.id });

      if (result) {
        setName("");
        setAmount("");
        refreshData();
        toast.success("New Expense Added!");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-5 rounded-2xl">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          placeholder="e.g. Bedroom Decor"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          placeholder="e.g. 1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button
        disabled={!(name && amount) || loading}
        onClick={addNewExpense}
        className="mt-3 w-full rounded-full"
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
      </Button>
    </div>
  );
}

export default AddExpense;
