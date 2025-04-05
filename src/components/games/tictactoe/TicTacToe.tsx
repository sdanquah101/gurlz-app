import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../../store/gameStore';
import GameLobby from '../GameLobby';
import Board from './Board';
import GameStatus from './GameStatus';
import { motion } from 'framer-motion';
import { gameSocket } from '../../../services/gameSocket';

export default function TicTacToe() {
  const { gameState, currentGame } = useGameStore();
  const [board, setBoard] = useState<Array<'X' | 'O' | null>>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<'X' | 'O' | 'draw' | null>(null);

  // If no game is in progress, show the lobby
  if (!currentGame || !gameState) {
    return <GameLobby gameType="tictactoe" gameName="Tic Tac Toe" />;
  }

  useEffect(() => {
    gameSocket.onGameMove((move) => {
      if (move.moveType === 'tictactoe') {
        const { position, value } = move;
        if (position !== undefined && value) {
          const newBoard = [...board];
          newBoard[position] = value as 'X' | 'O';
          setBoard(newBoard);
          setCurrentPlayer(value === 'X' ? 'O' : 'X');
          checkWinner(newBoard);
        }
      }
    });

    return () => {
      gameSocket.disconnect();
    };
  }, [board]);

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;

    gameSocket.makeMove({
      gameId: gameState.gameType,
      playerId: 'current-player',
      moveType: 'tictactoe',
      position: index,
      value: currentPlayer,
      timestamp: new Date()
    });

    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    checkWinner(newBoard);
  };

  const checkWinner = (currentBoard: Array<'X' | 'O' | null>) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const [a, b, c] of lines) {
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        setWinner(currentBoard[a]);
        return;
      }
    }

    if (!currentBoard.includes(null)) {
      setWinner('draw');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <GameStatus 
          currentPlayer={currentPlayer}
          winner={winner}
          opponent={gameState.opponent}
        />
        
        <Board 
          board={board}
          onCellClick={handleCellClick}
          currentPlayer={currentPlayer}
          winner={winner}
        />
      </motion.div>
    </div>
  );
}