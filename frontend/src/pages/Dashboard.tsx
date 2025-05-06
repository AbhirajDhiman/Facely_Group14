import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { useGroup } from '@/context/GroupContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { SectionHeading } from '@/components/ui/section-heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateGroupDialog from '@/components/groups/CreateGroupDialog';
import JoinGroupDialog from '@/components/groups/JoinGroupDialog';
import GroupCard from '@/components/groups/GroupCard';
import { EmptyState } from '@/components/ui/empty-state';
import { Users, UserPlus, Plus, CloudCog } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { user } = useAuth();
  const { createdGroups, joinedGroups, loading, fetchMyGroups } = useGroup();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchMyGroups();

  }, []);

  console.log("createdGroups", createdGroups);
  console.log("joinedGroups", joinedGroups);
  const filteredGroups = activeTab === 'created'
    ? createdGroups
    : activeTab === 'joined'
      ? joinedGroups
      : [
        ...createdGroups,
        ...joinedGroups.filter(g =>
          !createdGroups.some(cg => cg._id.toString() === g._id.toString())
        )
      ];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
              <p className="text-muted-foreground">
                Manage your groups and access shared photos
              </p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <CreateGroupDialog />
              <JoinGroupDialog />
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Users size={16} />
                <span>All Groups</span>
              </TabsTrigger>
              <TabsTrigger value="created" className="flex items-center gap-2">
                <Plus size={16} />
                <span>Created</span>
              </TabsTrigger>
              <TabsTrigger value="joined" className="flex items-center gap-2">
                <UserPlus size={16} />
                <span>Joined</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {loading ? (
                <GroupsLoading />
              ) : filteredGroups.length === 0 ? (
                <EmptyState
                  icon={<Users size={48} />}
                  title="No Groups Yet"
                  description="Create a new group or join an existing one to start sharing photos."
                  action={{
                    label: "Create Your First Group",
                    onClick: () => document.querySelector("button")?.click()
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGroups.map(group => (
                    console.log("filteredGroups", filteredGroups),
                    // console.log(group),
                    <GroupCard
                      key={group._id.toString() + Math.random().toString()}
                      group={group}
                      isCreator={createdGroups.some(cg => cg._id.toString() === group._id.toString())}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="created">
              {loading ? (
                <GroupsLoading />
              ) : createdGroups.length === 0 ? (
                <EmptyState
                  icon={<Plus size={48} />}
                  title="No Created Groups"
                  description="Create your first group to start sharing photos with face recognition."
                  action={{
                    label: "Create Group",
                    onClick: () => document.querySelector("button")?.click()
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {createdGroups.map(group => (
                    <GroupCard
                      key={group._id.toString() + Math.random().toString()}
                      group={group}
                      isCreator={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="joined">
              {loading ? (
                <GroupsLoading />
              ) : joinedGroups.filter(g => !createdGroups.some(cg => cg._id.toString() === g._id.toString())).length === 0 ? (
                <EmptyState
                  icon={<UserPlus size={48} />}
                  title="No Joined Groups"
                  description="Join a group using an invite code to see shared photos."
                  action={{
                    label: "Join a Group",
                    onClick: () => document.querySelectorAll("button")[1]?.click()
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {joinedGroups
                    .filter(g =>
                      !createdGroups.some(cg => cg._id.toString() === g._id.toString())
                    )
                    .map(group => (
                      <GroupCard
                        key={group._id.toString() + Math.random().toString()}
                        group={group}
                        isCreator={false}
                      />
                    ))
                  }
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

const GroupsLoading = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="border rounded-lg overflow-hidden">
        <Skeleton className="h-24 w-full" />
        <div className="p-6 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full mt-4" />
        </div>
      </div>
    ))}
  </div>
);

export default Dashboard;
