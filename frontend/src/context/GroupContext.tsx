
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/config';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface Group {
  _id: string;
  name: string;
  creator: {
    _id: string;
    name: string;
    profilePic: string;
  };
  inviteCode: string;
  members: Array<{
    _id: string;
    name: string;
    profilePic: string;
  }>;
  gallery: string[];
}

interface GroupContextType {
  createdGroups: Group[];
  joinedGroups: Group[];
  currentGroup: Group | null;
  loading: boolean;
  fetchMyGroups: () => Promise<void>;
  createGroup: (name: string) => Promise<void>;
  joinGroup: (inviteCode: string) => Promise<void>;
  uploadGroupImage: (groupId: string, formData: FormData) => Promise<any>;
  getGroupImages: (groupId: string) => Promise<any>;
  getGroupInfo: (groupId: string) => Promise<void>;
  setCurrentGroup: (group: Group | null) => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const [createdGroups, setCreatedGroups] = useState<Group[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<Group[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const fetchMyGroups = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.GROUP.MY_GROUPS}`);
      if (res.data.success) {
        console.log("res.data.createdGroups", res.data.createdGroups);
        console.log("res.data.joinedGroups", res.data.joinedGroups);
        setCreatedGroups(res.data.createdGroups);
        setJoinedGroups(res.data.joinedGroups);
      }
    } catch (error: any) {
      toast({
        title: "Failed to fetch groups",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (name: string) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.GROUP.CREATE}`, { name });
      if (res.data.success) {
        toast({
          title: "Group created",
          description: `Group "${name}" created successfully with invite code: ${res.data.inviteCode}`,
        });
        await fetchMyGroups();
      }
    } catch (error: any) {
      toast({
        title: "Failed to create group",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (inviteCode: string) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.GROUP.JOIN}`, { inviteCode });
      if (res.data.success) {
        toast({
          title: "Group joined",
          description: `You joined "${res.data.group.name}" successfully`,
        });
        await fetchMyGroups();
      }
    } catch (error: any) {
      toast({
        title: "Failed to join group",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const uploadGroupImage = async (groupId: string, formData: FormData) => {
    try {
      setLoading(true);
      const url = `${API_BASE_URL}${API_ENDPOINTS.GROUP.UPLOAD_IMAGE.replace('groupId', groupId)}`;
      const res = await axios.post(url, formData);
      if (res.data.success) {
        toast({
          title: "Image uploaded",
          description: "Image has been uploaded successfully",
        });
      }
      return res.data;
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getGroupImages = async (groupId: string) => {
    try {
      setLoading(true);
      const url = `${API_BASE_URL}${API_ENDPOINTS.GROUP.GET_IMAGES.replace('groupId', groupId)}`;
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      toast({
        title: "Failed to fetch images",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getGroupInfo = async (groupId: string) => {
    try {
      setLoading(true);
      const url = `${API_BASE_URL}${API_ENDPOINTS.GROUP.GET_INFO.replace('groupId', groupId)}`;
      const res = await axios.get(url);
      if (res.data.success) {
        console.log("res.data.group", res.data.group);
        setCurrentGroup(res.data.group);
      }
      return res.data;
    } catch (error: any) {
      toast({
        title: "Failed to fetch group info",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyGroups();
    }
  }, [isAuthenticated]);

  return (
    <GroupContext.Provider
      value={{
        createdGroups,
        joinedGroups,
        currentGroup,
        loading,
        fetchMyGroups,
        createGroup,
        joinGroup,
        uploadGroupImage,
        getGroupImages,
        getGroupInfo,
        setCurrentGroup
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
};
