import type { ComponentType, SVGProps } from 'react';
import { ChildFigure, EngineerFigure, StudentFigure, TeenFigure } from './figures';
import { Moon, Stars, Sun } from './sky';
import { FarHills } from './far';
import { CampusGate, DormBlock, GradCap, Hospital, ShopFront, SchoolGate, Trophy } from './mid';
import { GroundPath } from './ground';
import { GrassTufts } from './foreground';

export type ArtAsset = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Central placeholder-art registry: every SVG the journey engine
 * renders goes through here, so swapping any asset (e.g. replacing a
 * stage silhouette with the parameterised rig in 5B-ART, or adding the
 * finale art in 5C) means changing ONE import in this file.
 */
export const art = {
  figures: {
    0: ChildFigure,
    1: TeenFigure,
    2: StudentFigure,
    3: EngineerFigure,
  },
  sky: {
    sun: Sun,
    moon: Moon,
    stars: Stars,
  },
  far: {
    hills: FarHills,
  },
  mid: {
    schoolGate: SchoolGate,
    dormBlock: DormBlock,
    campusGate: CampusGate,
    trophy: Trophy,
    hospital: Hospital,
    shopFront: ShopFront,
    gradCap: GradCap,
  },
  ground: {
    path: GroundPath,
  },
  foreground: {
    tufts: GrassTufts,
  },
} as const;

export type ArtRegistry = typeof art;
