import React, { useState } from 'react';
import { TaskProvider } from '@/context/TaskContext';
import { TaskHeader } from '@/components/TaskHeader';
import { TaskForm } from '@/components/TaskForm';
import { TaskTable } from '@/components/TaskTable';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <TaskProvider>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <TaskHeader />
        
        <div className="mt-6 flex justify-end items-center">
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="rounded-full transition-all duration-300 shadow-md"
            variant="outline"
          >
            {showForm ? (
              <>
                <X className="mr-2 h-4 w-4" /> Cancel
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Advanced
              </>
            )}
          </Button>
        </div>
        
        {showForm && (
          <div className="mt-6 max-w-2xl mx-auto">
            <TaskForm />
          </div>
        )}
        
        <Tabs defaultValue="all" className="mt-8">
          <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto mb-6">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="animate-slide-in">
            <TaskTable />
          </TabsContent>
          
          <TabsContent value="pending" className="animate-slide-in">
            {/* We'll implement filtered views in the future */}
            <TaskTable />
          </TabsContent>
          
          <TabsContent value="completed" className="animate-slide-in">
            {/* We'll implement filtered views in the future */}
            <TaskTable />
          </TabsContent>
          
          <TabsContent value="other" className="animate-slide-in">
            {/* We'll implement filtered views in the future */}
            <TaskTable />
          </TabsContent>
        </Tabs>
      </div>
    </TaskProvider>
  );
};

export default Index;
