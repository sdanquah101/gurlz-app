import { Request, Response } from 'express';
import { GameSession } from '../models/GameSession';
import { User } from '../models/User';

export const createGameSession = async (req: Request, res: Response) => {
  try {
    const { gameType, players } = req.body;
    
    const session = new GameSession({
      gameType,
      players: players.map((id: string) => ({ userId: id })),
      status: 'waiting'
    });
    
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error creating game session' });
  }
};

export const getOnlinePlayers = async (req: Request, res: Response) => {
  try {
    const players = await User.find({ 
      'lastActive': { $gte: new Date(Date.now() - 5 * 60 * 1000) } // Online in last 5 minutes
    }).select('username email');
    
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching online players' });
  }
};

export const updateGameSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { move, status } = req.body;
    
    const session = await GameSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Game session not found' });
    }
    
    if (move) {
      session.moves.push(move);
    }
    
    if (status) {
      session.status = status;
      if (status === 'completed') {
        session.endTime = new Date();
      }
    }
    
    await session.save();
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error updating game session' });
  }
};