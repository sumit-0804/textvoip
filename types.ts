// types/index.ts (or wherever @/types points)
import { Server as NetServer } from "http";
import { Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Member, Profile, Server } from '@prisma/client';

type MemberWithProfiles = Member & {
  profile: Profile;
};

export type ServerWithMembersWithProfiles = Server & {
  members: MemberWithProfiles[];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};