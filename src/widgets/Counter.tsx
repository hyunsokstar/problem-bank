// src/widgets/Counter.tsx
"use client";

import { useCounterStore } from "@/shared/store/counterStore";
import { Button } from "@/shared/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shared/ui/card";

export default function Counter() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div className="mt-10 flex justify-center">
      <Card className="max-w-sm mx-auto p-6 shadow-lg border border-gray-300">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">Counter</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <h2 className="text-4xl font-bold text-gray-800">{count}</h2>
        </CardContent>
        <CardFooter className="flex justify-between space-x-2">
          <Button onClick={decrement} variant="outline" className="w-1/3">
            -1
          </Button>
          <Button onClick={reset} variant="ghost" className="w-1/3">
            Reset
          </Button>
          <Button onClick={increment} variant="default" className="w-1/3">
            +1
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
