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
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Crown, KeyRound, ArrowRight, Zap, Sparkles } from "lucide-react";
import { useRef, useState } from "react";

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

const getInitials = (name: string | undefined) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const PARTICLE_COUNT = 8;
const MAX_DISPLAY_MEMBERS = 4;

export default function GroupCard({ group, isCreator }: GroupCardProps) {
  // 3D tilt effect
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [0, 1], [8, -8]);
  const rotateY = useTransform(x, [0, 1], [-8, 8]);

  // For spotlight effect
  const [spotlight, setSpotlight] = useState<{ x: number; y: number } | null>(null);

  function handleMouseMove(e: React.MouseEvent) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px);
    y.set(py);
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
    setSpotlight(null);
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      style={{ rotateX, rotateY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group/card overflow-hidden rounded-2xl shadow-xl border border-border/20 h-full flex flex-col bg-background/80 backdrop-blur-lg"
    >
      {/* Subtle, soft elliptical spotlight gradient follows mouse on hover */}
      {spotlight && (
        <div
          className="pointer-events-none absolute z-10"
          style={{
            left: spotlight.x - 180,
            top: spotlight.y - 80,
            width: 360,
            height: 160,
            background:
              'radial-gradient(ellipse 60% 30% at 50% 50%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.10) 60%, transparent 100%)',
            borderRadius: '50% / 30%',
            transition: 'opacity 0.2s',
            opacity: 1,
            filter: 'blur(2px)',
          }}
        />
      )}

      <div className="flex flex-col flex-grow relative z-10 p-6">
        <CardHeader className="p-0 mb-4">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-2xl font-bold text-foreground tracking-tight group-hover/card:text-primary transition-colors duration-300">
              {group.name}
            </CardTitle>
            {isCreator && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 flex items-center gap-1.5 text-xs py-1 px-2">
                <Crown size={14} /> Admin
              </Badge>
            )}
          </div>
          <CardDescription className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Zap size={14} className="text-primary/70" />
            AI-Enhanced Collaboration Space
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-grow">
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Members ({group.members.length})</p>
              {group.members.length > MAX_DISPLAY_MEMBERS && (
                <span className="text-xs text-primary">+{group.members.length - MAX_DISPLAY_MEMBERS} more</span>
              )}
            </div>
            <div className="flex -space-x-3 items-center">
              {group.members.slice(0, MAX_DISPLAY_MEMBERS).map((member, index) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Avatar className="h-9 w-9 border-2 border-background group-hover/card:border-primary/20 transition-colors duration-300 shadow-md">
                    <AvatarImage src={member.profilePic} alt={member.name} />
                    <AvatarFallback className="text-xs bg-muted text-muted-foreground">{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                </motion.div>
              ))}
              {group.members.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No members yet.</p>
              )}
            </div>
          </div>
          {isCreator && group.inviteCode && (
            <div className="mb-5 p-3 bg-muted/50 rounded-lg border border-dashed border-border/30">
              <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                <KeyRound size={14} /> Group Invite Code:
              </p>
              <code className="text-sm font-mono text-primary bg-primary/10 py-1 px-2 rounded block w-full truncate">{group.inviteCode}</code>
            </div>
          )}
          {!isCreator && (
            <div className="text-xs text-muted-foreground flex items-center gap-2 mb-4">
              <Avatar className="h-6 w-6 border-border/50">
                <AvatarImage src={group.creator.profilePic} alt={group.creator.name} />
                <AvatarFallback className="text-xxs">{getInitials(group.creator.name)}</AvatarFallback>
              </Avatar>
              <span>Created by <span className="font-medium text-foreground">{group.creator.name}</span></span>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-0 mt-auto">
          <Link to={`/group/${group._id}`} className="w-full">
            <motion.button
              type="button"
              className="w-full group/button bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform group-hover/card:scale-[1.03] focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background relative overflow-hidden"
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10 flex items-center justify-center">
                View Group Hub
                <ArrowRight size={18} className="ml-2 opacity-0 group-hover/button:opacity-100 -translate-x-2 group-hover/button:translate-x-0 transition-all duration-300" />
              </span>
              {/* Pulse effect */}
              <span className="absolute inset-0 rounded-xl bg-primary/30 opacity-0 group-hover/button:opacity-40 animate-pulse pointer-events-none" />
            </motion.button>
          </Link>
        </CardFooter>
      </div>
    </motion.div>
  );
}
