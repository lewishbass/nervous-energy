

import { SmallMissile } from "./small_missile";
import { Missile } from "./missile";
import { Projectile } from "../Projectile";
import { Shower } from "./shower";
import { HotShower } from "./hot_shower";
import { SmallAtomBomb, AtomBomb } from "./atom_bombs";
import { VolcanoBomb } from "./volcano_bomb";
import { SmallBall, Ball, LargeBall, SmallBallV2, BallV2, LargeBallV2 } from "./balls";

const projectilelist:Record<string, typeof Projectile> = {
	'small_missile': SmallMissile,
	'missile': Missile,
	'small_atom_bomb' : SmallAtomBomb,
	'atom_bomb' : AtomBomb,
	'volcano_bomb' : VolcanoBomb,
	'shower' : Shower,
	'hot_shower' : HotShower,
	'small_ball' : SmallBall,
	'ball' : Ball,
	'large_ball' : LargeBall,
	'small_ball_v2' : SmallBallV2,
	'ball_v2' : BallV2,
	'large_ball_v2' : LargeBallV2,
	'air_strike' : Projectile,
}

export { projectilelist };
