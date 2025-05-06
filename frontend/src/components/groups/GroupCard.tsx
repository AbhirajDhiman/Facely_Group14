import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface GroupCardProps {
  group: {
    _id: string;
    name: string;
    creator: {
      _id: string;
      name: string;
      profilePic: string;
    };
    inviteCode?: string;
    members: Array<{
      _id: string;
      name: string;
      profilePic: string;
    }>;
  };
  isCreator?: boolean;
}

const GroupCard = ({ group, isCreator }: GroupCardProps) => {
  
  const getInitials = (name: string | undefined) => {
    if (!name) return ''; // Return an empty string or a default value if name is undefined
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="overflow-hidden hover-lift">
      <CardHeader className="bg-accent/5">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{group.name}</CardTitle>
            <CardDescription className="mt-1">
              Created by {group.creator.name}
            </CardDescription>
          </div>
          {isCreator && (
            <Badge variant="outline" className="bg-accent/10 text-accent">
              Created by you
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Members ({group.members.length})</p>
          <div key={group._id} className="flex -space-x-2">
            {group.members.slice(0, 5).map((member) => (
              <Avatar key={member._id} className="border-2 border-background">
                <AvatarImage key={member._id} src={member.profilePic} alt={member.name} />
                <AvatarFallback key={member._id}>{getInitials(member.name)}</AvatarFallback>
              </Avatar>
            ))}
            {group.members.length > 5 && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                +{group.members.length - 5}
              </div>
            )}
          </div>
        </div>
        
        {isCreator && group.inviteCode && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Invite code</p>
            <code className="text-sm bg-muted p-1 rounded">{group.inviteCode}</code>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link to={`/group/${group._id}`} className="w-full">
          <Button variant="default" className="w-full">
            View Group
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default GroupCard;
