enum GameType {
  ranked = 'RANKED',
  quick = 'QUICK',
  custom = 'CUSTOM',
}

enum GameState {
  waiting = 'WAITING',
  running = 'RUNNING',
  finished = 'FINISHED',
}

enum WinCondition {
  combination = 'COMBINATION',
  time = 'TIME',
  disconnect = 'DISCONNECT',
}

enum Opening {
  standart = 'STANDART',
  swap = 'SWAP',
  swap2 = 'SWAP2',
}

export interface Player {
  socketID: string;
  username: string;
  logged: boolean;
  secondsLeft?: number;
}

abstract class Game {
  id: string;
  players: Player[] = [];
  winner: Player;
  startingPlayer: Player;
  round: number = 0;
  gameboardSize: number = 15;
  gameboard: number[][] = this.generateGameboard(this.gameboardSize);
  turns: Array<[number, number]>;
  gameType: GameType;
  gameState: GameState;
  opening: Opening;
  timeLimitInSeconds: number;
  calibrationTimestamp: number;
  winCondition: WinCondition;

  constructor(id: string) {
    this.id = id;
  }

  public addPlayer(player: Player): void {
    if (this.players.length < 2) {
      if (this.players[0]) {
        if (this.players[0].username === player.username && player.username) {
          throw 'Are you a schizophrenic?';
        }
      }
      player.secondsLeft = this.timeLimitInSeconds;
      this.players.push(player);
    } else {
      throw 'Game is already full';
    }
  }

  public setStartingPlayer(): Player {
    return (this.startingPlayer = this.players[Math.round(Math.random())]);
  }

  public isFull(): boolean {
    return this.players.length >= 2;
  }

  private generateGameboard(size: number): number[][] {
    const gameboard: number[][] = [];
    for (let i = 0; i < size; i++) {
      gameboard.push([]);
      for (let ii = 0; ii < size; ii++) {
        gameboard[i].push(0);
      }
    }
    return gameboard;
  }
}

class QuickGame extends Game {
  timeLimitInSeconds = 2 * 60;
}

class RankedGame extends Game {
  timeLimitInSeconds = 3 * 60;
  eloDiff: number = 0;
}

export { QuickGame, RankedGame };
