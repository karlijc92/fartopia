import Splash from './pages/Splash';
import Home from './pages/Home';
import MiniGame from './pages/MiniGame';
import MyCreatures from './pages/MyCreatures';
import Shop from './pages/Shop';
import Habitat from './pages/Habitat';
import Settings from './pages/Settings';
import GameMenu from './pages/GameMenu';
import MemoryGame from './pages/MemoryGame';
import BubbleGame from './pages/BubbleGame';
import RaceGame from './pages/RaceGame';
import PatternGame from './pages/PatternGame';
import DailyBonus from './pages/DailyBonus';


export const PAGES = {
    "Splash": Splash,
    "Home": Home,
    "MiniGame": MiniGame,
    "MyCreatures": MyCreatures,
    "Shop": Shop,
    "Habitat": Habitat,
    "Settings": Settings,
    "GameMenu": GameMenu,
    "MemoryGame": MemoryGame,
    "BubbleGame": BubbleGame,
    "RaceGame": RaceGame,
    "PatternGame": PatternGame,
    "DailyBonus": DailyBonus,
}

export const pagesConfig = {
    mainPage: "Splash",
    Pages: PAGES,
};
