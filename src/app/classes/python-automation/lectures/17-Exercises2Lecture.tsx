'use client';
import React, { useEffect, useState } from 'react';
import { LectureTemplate, LectureIcon } from './LectureTemplate';
import { CodeBlock } from '@/components/CodeBlock';
import Prism from 'prismjs';
import CopyCode from '../exercises/exercise-components/CopyCode';

import '@/styles/code.css';
import './lecture.css';

interface Exercises2LectureProps {
  displayMode?: 'scrollable' | 'slideshow';
  className?: string;
  style?: React.CSSProperties;
  exitFSCallback?: () => void;
}

function Exercises2Lecture(props: Exercises2LectureProps | null) {
  const { displayMode = 'scrollable', className = '', style = {}, exitFSCallback } = props || {};

  // april 15, 2026 at 8:00 PM 
  const UNLOCK_TIME = new Date('2026-04-15T20:00:00');
  const [solutionsUnlocked, setSolutionsUnlocked] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
    setSolutionsUnlocked(new Date() >= UNLOCK_TIME);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <LectureTemplate displayMode={displayMode} className={className} style={style} exitFSCallback={exitFSCallback}>
      {/* Title */}
      <section className="lecture-section mini-scroll">
        <h2 className="tc1 lecture-big-title">Exercises 2</h2>
        <h3 className="tc2 lecture-section-header">[ subtitle ]</h3>
      </section>

      {/* Table of contents */}
      <section className="lecture-section mini-scroll" id="sections-overview">
        <h3 className="lecture-section-header">Exercises</h3>
        <div className="lecture-header-decorator" />
        <ul className="list-['-'] list-inside tc2 space-y-1 ml-4">
          <li className="lecture-link" onClick={() => scrollToSection('exercise-1')}>Exercise 1 — Rocket ship</li>
          <li className="lecture-link" onClick={() => scrollToSection('exercise-2')}>Exercise 2 — Rocket Visualization</li>
          <li className="lecture-link" onClick={() => scrollToSection('exercise-3')}>Exercise 3 — Space Fighter</li>
          <li className="lecture-link" onClick={() => scrollToSection('exercise-4')}>Exercise 4 — Bullets</li>
          <li className="lecture-link" onClick={() => scrollToSection('exercise-5')}>Exercise 5 — Asteroids</li>
        </ul>
      </section>

      {/* Exercise 1 - Rocket ship */}
      <section className="lecture-section mini-scroll" id="exercise-1">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Exercise 1 - Rocket ship</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Objective:</span> Launch our rocket ship, and keep track of its altitude, velocity, and fuel levels as it ascends into space.<br/>
          Count down to liftoff, and print out the rocket's status at each stage of the launch sequence.
        </p>

        <ul className="lecture-exercise-list">
          <li className="lecture-exercise-item">
            Create variables to track each parameter
            <CodeBlock className="lecture-codeblock" language="python" 
              code={`# create a variable for altitude, velocity, and fuel levels
altitude = 0\n# add the rest here`} />
          </li>
          <li className="lecture-exercise-item">
            Use a for loop to count down to liftoff
            <ul className='list-disc list-inside ml-4'>
              <li>printing <CopyCode code="t-minus [ number ] seconds" /> at each step</li>
              <li>after printing, wait for 1 second with <CopyCode code="time.sleep(1)" /></li>
              <li>when the countdown reaches 0, print <CopyCode code='"Liftoff!"' /></li>
            </ul>
          </li>
          <li className="lecture-exercise-item">
            Create a while loop that that stops when the rocket reaches space (altitude &gt; 100km), or crashes (altitude &lt; 0)
          </li>
          <li className="lecture-exercise-item">
            updates the rockets altitude, velocity, and fuel levels as it ascends
            <ul className='list-disc list-inside ml-4'>
                <li>If there is fuel, accelerate by decreasing fuel and increasing velocity</li>
                <li>Apply drag to the velocity</li>
                <li>Update the altitude based on the velocity</li>
            </ul>
          </li>
          <li className="lecture-exercise-item">
            prints out the rocket's status at each stage of the launch sequence
            <ul className='list-disc list-inside ml-4'>
                <li>During liftoff, print the countdown</li>
                <li>During ascent, print the altitude, velocity, and fuel levels at each step</li>
            </ul>
            Use <CopyCode code="print('info', end='\\r')" /> to update the same line with the rocket's current status during ascent
          </li>
          <li className="lecture-exercise-item">
            If the rocket reaches space, print a congratulatory message with the final altitude and velocity<br/>
            If the rocket crashes, print a message with the final altitude and velocity
          </li>
        </ul>

        {solutionsUnlocked ? (
          <>
            <div className="lecture-solutions-divider"><span className="lecture-solutions-label">Solution</span></div>
            <CodeBlock className="lecture-codeblock" language="python"
              code={`# Initialize rocket parameters
altitude = 0  # meters
velocity = 0  # m/s
fuel = 100  # liters
max_altitude = 100000  # 100km - space boundary
drag_coefficient = 0.1  # slows velocity each iteration
fuel_burn_rate = 1  # fuel consumed per iteration
acceleration = 5  # m/s gained per fuel unit

# Countdown to liftoff
print("Preparing for launch...")
for t in range(10, 0, -1):
  print(f"T-minus {t} seconds", end='\r')
  time.sleep(1)
print("Liftoff!           ")

# Main flight loop
while 0 <= altitude <= max_altitude:
  # Accelerate if fuel available
  if fuel > 0:
    velocity += acceleration
    fuel -= fuel_burn_rate
  
  # Apply drag to velocity
  velocity *= (1 - drag_coefficient)
  
  # Update altitude based on velocity
  altitude += velocity
    
  # Display current status
  print(f"Alt: {altitude:,.0f}m | Vel: {velocity:,.1f}m/s | Fuel: {fuel:.1f}L", end='\\r')
  
  time.sleep(0.1)

# Print final status
print()  # new line after status updates
if altitude >= max_altitude:
  print(f"🚀 Success! Reached space at {altitude:,.0f}m with velocity {velocity:,.1f}m/s")
else:
  print(f"💥 Crashed at altitude {altitude:,.0f}m with velocity {velocity:,.1f}m/s")`} />
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-400/40 bg-gray-100/40 dark:bg-gray-800/30 px-5 py-4 my-4 tc2" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : '0.9rem' }}>
            <span className="text-2xl">&#x1f512;</span>
            <span>Solution unlocked after class on <span className="lecture-bold">{UNLOCK_TIME.toLocaleString()}</span>.</span>
          </div>
        )}
      </section>

      {/* Exercise 2 - Rocket Visualization */}
      <section className="lecture-section mini-scroll" id="exercise-2">
          <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Exercise 2 - Rocket Visualization</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Objective:</span> Use <span className='lecture-bold'>pygame</span> to visualize the rockets ascent
        </p>

        <ul className="lecture-exercise-list">
          <li className="lecture-exercise-item">
            Import <span className='lecture-bold'>pygame</span>
            <CodeBlock className="lecture-codeblock" language="python" 
              code={`# import the pygame library\nimport pygame`} />
          </li>
          <li className="lecture-exercise-item">
            Init and destroy the pygame window properly
            <CodeBlock className="lecture-codeblock" language="python" 
              code={`# initialize pygame\npygame.init()\n\n# game logic will go between these statements\n\n# quit pygame\npygame.quit()`} />
          </li>
          <li className="lecture-exercise-item">
            Create the pygame screen object, supply a width and height in pixels.
            <CodeBlock className="lecture-codeblock" language="python" 
              code={`# create the screen object\nscreen = pygame.display.set_mode((width, height))`} />
          </li>
          <li className="lecture-exercise-item">
            Create a game loop that exits when the user closes the window
            <CodeBlock className="lecture-codeblock" language="python" 
              code={`# loops until the user closes the window\nrunning = True\nwhile running:\n  # check list of events\n  for event in pygame.event.get():\n    if event.type == pygame.QUIT:\n      # set running to false so the loop exits\n      running = False`} />
          </li>
          <li className="lecture-exercise-item">
            Track the time since the last frame to create a smooth animation
            <ul className='list-disc list-inside ml-4'>
              <li>initialize the <CopyCode code={'lastFrame'}/> variable with the current time, <CopyCode code={'time.time()'}/></li>
              Inside the game loop:
              <li>calculate the <CopyCode code={'delta_time'}/> variable by subtracting the last frame time from the current time</li>
              <li>update the last frame time to the current time at the end of each loop</li>
            </ul>
            <CodeBlock className="lecture-codeblock" language="python" 
              code={`# update the lastFrame variable\nlastFrame = time.time()\n`} />
          </li>
          <li className="lecture-exercise-item">
            Add your Rocket logic from Exercise 1 into the game loop, and update the rocket's parameters based on the time since the last frame (delta_time) instead of a fixed amount each loop.
          </li>
          <li className="lecture-exercise-item">
            Calculate which y value on the screen to draw the rocket.
            <ul className='list-disc list-inside ml-4'>
              <li>the bottom of the screen (ground level) should correspond to an altitude of 0</li>
              <li>the top of the screen should correspond to an altitude of 100km (space)</li>
              <li>In pygame, the coords (0, 0) correspond to the top left of the screen, so you will need to flip the y axis when calculating the rockets y position</li>
            </ul>
          </li>
          <li className="lecture-exercise-item">
            Draw the rocket on the screen
            <ul className='list-disc list-inside ml-4'>
              <li> Clear the screen each frame with <CopyCode code={'screen.fill((0, 0, 0))'}/> to fill it with black</li>
              <li>Draw the rocket as a rectangle with <CopyCode code={'pygame.draw.rect(screen, (255, 0, 0), (x, y, width, height))'}/></li>
              <li>Call <CopyCode code={'pygame.display.flip()'}/> at the end of each loop to update the display with the new drawing</li>
            </ul>
          </li>
        </ul>

        {solutionsUnlocked ? (
          <>
            <div className="lecture-solutions-divider"><span className="lecture-solutions-label">Solution</span></div>
            <CodeBlock className="lecture-codeblock" language="python"
              code={`import pygame
import time

# --- Window settings ---
WIDTH, HEIGHT = 400, 600
MAX_ALTITUDE = 100000  # 100 km = space boundary (meters)

# --- Rocket parameters ---
altitude = 0   # meters
velocity = 0   # m/s
fuel     = 100 # liters

# Physics constants
ACCELERATION = 50   # m/s² gained per second when burning fuel
DRAG         = 0.05 # fraction of velocity lost per second to drag
FUEL_BURN    = 5    # liters of fuel burned per second

# --- Setup ---
pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Rocket Launch")
font  = pygame.font.SysFont(None, 24)
clock = pygame.time.Clock()

# Countdown before launch
for t in range(10, 0, -1):
    screen.fill((0, 0, 0))
    label = font.render(f"T-minus {t} seconds", True, (255, 255, 255))
    screen.blit(label, (WIDTH // 2 - label.get_width() // 2, HEIGHT // 2))
    pygame.display.flip()
    time.sleep(1)

# --- Game loop ---
last_frame = time.time()
message    = ""
running    = True

while running:
    # Exit when the user closes the window
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Time since last frame - keeps physics frame-rate independent
    now        = time.time()
    dt         = now - last_frame
    last_frame = now

    # Update rocket physics while still in flight
    if not message:
        if fuel > 0:
            velocity += ACCELERATION * dt        # burn fuel to accelerate
            fuel      = max(0, fuel - FUEL_BURN * dt)

        velocity -= velocity * DRAG * dt         # drag slows the rocket
        altitude += velocity * dt                # move rocket by velocity

        # Check end conditions
        if altitude >= MAX_ALTITUDE:
            message = f"Reached space!  Vel: {velocity:.0f} m/s"
        elif altitude < 0:
            altitude = 0
            message  = "Crashed!"

    # --- Draw ---
    screen.fill((0, 0, 20))  # dark sky background

    # Map altitude to screen y (altitude 0 = bottom, MAX_ALTITUDE = top)
    screen_y = int(HEIGHT - (altitude / MAX_ALTITUDE) * HEIGHT) - 40

    # Draw the rocket as a red rectangle
    pygame.draw.rect(screen, (220, 60, 60), (WIDTH // 2 - 10, screen_y, 20, 40))

    # HUD - altitude, velocity, fuel
    hud = font.render(
        f"Alt: {altitude:,.0f} m   Vel: {velocity:.0f} m/s   Fuel: {fuel:.0f} L",
        True, (200, 200, 200)
    )
    screen.blit(hud, (10, 10))

    # Show end-of-flight message in the centre of the screen
    if message:
        msg = font.render(message, True, (255, 255, 100))
        screen.blit(msg, (WIDTH // 2 - msg.get_width() // 2, HEIGHT // 2))

    pygame.display.flip()  # push the new frame to the screen
    clock.tick(60)         # cap at 60 FPS

pygame.quit()`} />
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-400/40 bg-gray-100/40 dark:bg-gray-800/30 px-5 py-4 my-4 tc2" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : '0.9rem' }}>
            <span className="text-2xl">&#x1f512;</span>
            <span>Solution unlocked after class on <span className="lecture-bold">{UNLOCK_TIME.toLocaleString()}</span>.</span>
          </div>
        )}
      </section>

      {/* Exercise 3 - Space Fighter */}
      <section className="lecture-section mini-scroll" id="exercise-3">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Exercise 3 - Space Fighter</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Objective:</span> Use pygame to make a simple, controllable space fighter that can fly around the screen.
        </p>

        <ul className="lecture-exercise-list">
          <li className="lecture-exercise-item">
            Set up the empty pygame window
            <CodeBlock className="lecture-codeblock" language="python" 
              code={`import pygame\n\npygame.init()\n\n# Set up the display\nscreen = pygame.display.set_mode((800, 600))\npygame.display.set_caption("Space Fighter")\n\n# ---- Init Variables ----\n\n\n# Main loop\nrunning = True\nwhile running:\n   # ---- Event Section ----\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            running = False\n\n   # ---- Update Section ----\n\n\n   # ---- Draw Section ---\n    screen.fill((0, 0, 0))  # Clear the screen with black\n    pygame.display.flip()\n\npygame.quit()`} />
          </li>
          <li className="lecture-exercise-item">
            Init the fighter with the following variables:
            <ul className='list-disc list-inside ml-4'>
              <li> <CopyCode code='px'/>, <CopyCode code='py'/> - position</li>
              <li> <CopyCode code='vx'/>, <CopyCode code='vy'/> - velocity</li>
              <li> <CopyCode code='angle'/> - orientation of the fighter</li>
            </ul>
            It should start with zero velocity at the center of the screen.
          </li>
          <li className="lecture-exercise-item">
            In the <span className='lecture-bold'>Draw Section</span>, draw the fighter as a triangle that points in the direction of the angle variable<br/>
              You can calculate the points of the triangle based on the angle with some trigonometry.
            <CodeBlock className="lecture-codeblock" language="python" 
              code={`# calculate each point of the triangle based on the angle\np0 = size*math.cos(angle), size*math.sin(angle)\np1 = -size*math.cos(angle), -size*math.sin(angle)\np2 = -size*math.sin(angle), size*math.cos(angle)`} />
              Then add the fighter's position to each point to get the final coordinates to draw with pygame.<br/>
              Use the <CopyCode code='pygame.draw.polygon'/> function to draw the triangle on the screen.
              <CodeBlock className="lecture-codeblock" language="python"
              code={'# draw the triangle with pygame.draw.polygon\npygame.draw.polygon(screen, (255, 255, 255), [(p0x, p0y), (p1x, p1y), (p2x, p2y)])'} />
          </li>
          <li className="lecture-exercise-item">
            In the <span className='lecture-bold'>Input Section</span>, check the status of the arrow keys, and update the fighter's velocity and angle based on which keys are pressed.
            <CodeBlock className="lecture-codeblock" language="python" 
              code={`keys = pygame.key.get_pressed()\nif keys[pygame.K_UP]:\n     # accelerate in facing direction\nelif keys[pygame.K_DOWN]:\n     # decelerate or move backward\nelif keys[pygame.K_LEFT]:\n     # Rotate left\nelif keys[pygame.K_RIGHT]:\n     # Rotate right`} />
          </li>
          <li className="lecture-exercise-item">
            In the <span className='lecture-bold'>Update Section</span>, update the fighter's position based on its velocity 
            <ul className='list-disc list-inside ml-4'>
              <li>add the velocity to the position (multiply by the time delta)</li>
              <li>multiply the velocity by a friction factor to simulate drag (use friction ** time delta)</li>
              <li>make the fighter wrap around the screen edges using modulo operation on its position</li>
            </ul>
            <CodeBlock className="lecture-codeblock" language="python" 
              code={`# update velocity\npx = px + vx * delta_time`} />
          </li>
        </ul>

        {solutionsUnlocked ? (
          <>
            <div className="lecture-solutions-divider"><span className="lecture-solutions-label">Solution</span></div>
            <CodeBlock className="lecture-codeblock" language="python"
              code={`import pygame
import math
import time

# --- Window settings ---
WIDTH, HEIGHT = 800, 600
SIZE          = 15   # triangle half-size in pixels

# Physics constants
THRUST   = 250   # acceleration (pixels/s\u00b2) when thrusting
ROTATE   = 3.0   # rotation speed (radians/s)
FRICTION = 0.4   # fraction of velocity remaining after 1 second (0 = stops instantly, 1 = no drag)

# --- Initial fighter state ---
px, py = WIDTH / 2, HEIGHT / 2  # start at centre of screen
vx, vy = 0.0, 0.0               # start stationary
angle  = -math.pi / 2           # facing up (-y is up in pygame)

# --- Setup ---
pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Space Fighter")
clock  = pygame.time.Clock()

last_frame = time.time()
running    = True

while running:
    # ---- Event Section ----
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Delta time - keeps movement frame-rate independent
    now        = time.time()
    dt         = now - last_frame
    last_frame = now

    # ---- Input Section (held keys for smooth control) ----
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        angle -= ROTATE * dt                     # rotate counter-clockwise
    if keys[pygame.K_RIGHT]:
        angle += ROTATE * dt                     # rotate clockwise
    if keys[pygame.K_UP]:
        vx += math.cos(angle) * THRUST * dt      # thrust in facing direction
        vy += math.sin(angle) * THRUST * dt
    if keys[pygame.K_DOWN]:
        vx -= math.cos(angle) * THRUST * dt      # brake / reverse
        vy -= math.sin(angle) * THRUST * dt

    # ---- Update Section ----
    # Friction - exponential decay keeps it frame-rate independent
    decay = FRICTION ** dt
    vx   *= decay
    vy   *= decay

    # Move the fighter and wrap around screen edges
    px = (px + vx * dt) % WIDTH
    py = (py + vy * dt) % HEIGHT

    # ---- Draw Section ----
    screen.fill((0, 0, 20))  # deep space background

    # Build triangle vertices from the current angle
    # nose points forward, left/right wings are 2.4 radians (~137\u00b0) behind
    nose  = (px + SIZE * math.cos(angle),       py + SIZE * math.sin(angle))
    left  = (px + SIZE * math.cos(angle + 2.4), py + SIZE * math.sin(angle + 2.4))
    right = (px + SIZE * math.cos(angle - 2.4), py + SIZE * math.sin(angle - 2.4))

    pygame.draw.polygon(screen, (255, 255, 255), [nose, left, right])

    pygame.display.flip()  # push the new frame to the screen
    clock.tick(60)         # cap at 60 FPS

pygame.quit()`} />
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-400/40 bg-gray-100/40 dark:bg-gray-800/30 px-5 py-4 my-4 tc2" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : '0.9rem' }}>
            <span className="text-2xl">&#x1f512;</span>
            <span>Solution unlocked after class on <span className="lecture-bold">{UNLOCK_TIME.toLocaleString()}</span>.</span>
          </div>
        )}
      </section>

      {/* Exercise 4 - [ placeholder ] */}
      <section className="lecture-section mini-scroll" id="exercise-4">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Exercise 4 - Bullets</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Objective:</span> Add bullets to your space fighter that shoot in the direction the fighter is facing when you press the space bar.
        </p>

        <ul className="lecture-exercise-list">
          <li className="lecture-exercise-item">
            Create an empty list to track the bullets x pos, y pos, x velocity, and y velocity
            <CodeBlock className="lecture-codeblock" language="python" 
              code={`# empty list to track bullets\nbx = []`} />
          </li>
          <li className="lecture-exercise-item">
            In the <span className='lecture-bold'>Input Section</span>, check if the spacebar is pressed, and if it is, create a new bullets
            <CodeBlock className="lecture-codeblock" language="python" 
              code={`# check if spacebar is pressed\nif keys[pygame.K_SPACE]:\n    # create a new bullet`} />
            the bullets position should start at the fighters position, and its velocity should be in the direction of the fighters angle with a speed of your choice.<br/>Append the new bullet's position and velocity to the list you created to track bullets.
          </li>
          <li className="lecture-exercise-item">
            In the <span className='lecture-bold'>Update Section</span>, loop through each bullet in your list and update its position based on its velocity, just like you do with the fighter.<br/>
            <CodeBlock className="lecture-codeblock" language="python" 
              code={`# loop through each bullet\nfor i in range(len(bx)):\n    # update bullet position based on its velocity`} />
            In a separate loop, check if any bullets have gone off the screen, and if they have, remove them from the list.
          </li>
          <li className="lecture-exercise-item">
            In the <span className='lecture-bold'>Draw Section</span>, loop through each bullet and draw it on the screen as a small circle or rectangle.
            <CodeBlock className="lecture-codeblock" language="python" 
              code={`# loop through each bullet\nfor i in range(len(bx)):\n    # draw bullet on screen\n    pygame.draw.circle(screen, (255, 0, 0), (int(bx[i]), int(by[i])), 5)`} />
          </li>
        </ul>

        {solutionsUnlocked ? (
          <>
            <div className="lecture-solutions-divider"><span className="lecture-solutions-label">Solution</span></div>
            <CodeBlock className="lecture-codeblock" language="python"
              code={`import pygame
import math
import time

# --- Window settings ---
WIDTH, HEIGHT = 800, 600
SIZE          = 15    # triangle half-size in pixels
BULLET_SPEED  = 600   # pixels per second
BULLET_RADIUS = 4

# Physics constants
THRUST   = 250
ROTATE   = 3.0
FRICTION = 0.4

# --- Fighter state ---
px, py = WIDTH / 2, HEIGHT / 2
vx, vy = 0.0, 0.0
angle  = -math.pi / 2  # facing up

# --- Bullet lists (one entry per bullet) ---
bx  = []  # x position
by  = []  # y position
bvx = []  # x velocity
bvy = []  # y velocity

# --- Setup ---
pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Space Fighter")
clock = pygame.time.Clock()

last_frame = time.time()
running    = True

while running:
    # ---- Event Section ----
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Delta time
    now        = time.time()
    dt         = now - last_frame
    last_frame = now

    # ---- Input Section ----
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        angle -= ROTATE * dt
    if keys[pygame.K_RIGHT]:
        angle += ROTATE * dt
    if keys[pygame.K_UP]:
        vx += math.cos(angle) * THRUST * dt
        vy += math.sin(angle) * THRUST * dt
    if keys[pygame.K_DOWN]:
        vx -= math.cos(angle) * THRUST * dt
        vy -= math.sin(angle) * THRUST * dt

    # Spacebar - fire a bullet from the fighter's nose
    if keys[pygame.K_SPACE]:
        bx.append(px + SIZE * math.cos(angle))        # start at nose tip
        by.append(py + SIZE * math.sin(angle))
        bvx.append(math.cos(angle) * BULLET_SPEED)    # fly in facing direction
        bvy.append(math.sin(angle) * BULLET_SPEED)

    # ---- Update Section ----
    # Fighter friction and movement
    decay = FRICTION ** dt
    vx *= decay
    vy *= decay
    px  = (px + vx * dt) % WIDTH
    py  = (py + vy * dt) % HEIGHT

    # Move each bullet
    for i in range(len(bx)):
        bx[i] += bvx[i] * dt
        by[i] += bvy[i] * dt

    # Remove bullets that have left the screen (iterate backwards to avoid index shift)
    for i in range(len(bx) - 1, -1, -1):
        if bx[i] < 0 or bx[i] > WIDTH or by[i] < 0 or by[i] > HEIGHT:
            bx.pop(i); by.pop(i); bvx.pop(i); bvy.pop(i)

    # ---- Draw Section ----
    screen.fill((0, 0, 20))

    # Fighter triangle
    nose  = (px + SIZE * math.cos(angle),       py + SIZE * math.sin(angle))
    left  = (px + SIZE * math.cos(angle + 2.4), py + SIZE * math.sin(angle + 2.4))
    right = (px + SIZE * math.cos(angle - 2.4), py + SIZE * math.sin(angle - 2.4))
    pygame.draw.polygon(screen, (255, 255, 255), [nose, left, right])

    # Bullets
    for i in range(len(bx)):
        pygame.draw.circle(screen, (255, 80, 80), (int(bx[i]), int(by[i])), BULLET_RADIUS)

    pygame.display.flip()
    clock.tick(60)

pygame.quit()`} />
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-400/40 bg-gray-100/40 dark:bg-gray-800/30 px-5 py-4 my-4 tc2" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : '0.9rem' }}>
            <span className="text-2xl">&#x1f512;</span>
            <span>Solution unlocked after class on <span className="lecture-bold">{UNLOCK_TIME.toLocaleString()}</span>.</span>
          </div>
        )}
      </section>
      <section className="lecture-section mini-scroll" id="exercise-5">
        <h3 className="lecture-section-header" onClick={() => scrollToSection('sections-overview')}>Exercise 5 - Asteroids</h3>
        <div className="lecture-header-decorator" />
        <p className="lecture-paragraph">
          <span className="lecture-bold">Objective:</span> Add asteroids to the game that drift around the screen and collide with the fighter and bullets.
        </p>

        <ul className="lecture-exercise-list">
          <li className="lecture-exercise-item">
            Create a new list to track the asteroids x pos, y pos, x velocity, y velocity, and size
            <CodeBlock className="lecture-codeblock" language="python" 
              code={`# ax = []  # Asteroids x positions`}/>
          </li>
          <li className="lecture-exercise-item">
            In the <span className='lecture-bold'>Setup Section</span>, create some random asteroids with random positions, velocities, and sizes, and append them to your asteroid tracking list.
            <br/> If the random asteroid is too close to the fighter, skip creating it to avoid instant collisions at the start of the game.
            <CodeBlock className="lecture-codeblock" language="python" 
              code={`# create random asteroids\nfor i in range(num_asteroids):\n    ax.append(random.random()*WIDTH)`} />
          </li>
          <li className="lecture-exercise-item">
            In the <span className='lecture-bold'>Update Section</span>, update each asteroids position based on its velocity, just like you do with the fighter and bullets.<br/>
            <CodeBlock className="lecture-codeblock" language="python" 
              code={`# update asteroids positions\nfor i in range(len(ax)):\n    # update asteroids position`} />
            Use the modulo operator to make the asteroids wrap around the screen edges like the fighter.
          </li>
          <li className="lecture-exercise-item">
            In the <span className='lecture-bold'>Draw Section</span>, loop through each asteroid and draw it on the screen as a circle with a radius based on its size.
            <CodeBlock className="lecture-codeblock" language="python" 
              code={`# loop through each asteroid\nfor i in range(len(ax)):\n    # draw asteroid on screen\n    pygame.draw.circle(screen, (100, 100, 100), (int(x), int(y)), int(size))`} />
          </li>
          <li className="lecture-exercise-item">
            In the <span className='lecture-bold'>Update Section</span> check if the number of asteroids has decreased below a certain threshold, and if so, create new asteroids to maintain the desired number.<br/>
            <CodeBlock className="lecture-codeblock" language="python" 
              code={`# check if number of asteroids is below threshold\nif len(ax) < MIN_ASTEROIDS:\n    # create new asteroids`} />
            use a random choice to decide which edge to spawn the new asteroid on, and give it a random velocity.
            <CodeBlock className="lecture-codeblock" language="python"
            code={'# make a random choice\nif random.random() < 0.5:\n    # spawn on left or right edge\nelse:\n    # spawn on top or bottom edge'} />
          </li>
          <li className="lecture-exercise-item">
            In the <span className='lecture-bold'>Update Section</span> check if the distance between the fighter and any asteroid is less than the asteroid's size plus the fighter's size, and if so, end the game with a collision message.
            <CodeBlock className="lecture-codeblock" language="python"
            code={`# check distance between asteroid and fighter\ndist = math.hypot(ax[i] - px, ay[i] - py)`} />
          </li>
          <li>
            In the <span className='lecture-bold'>Update Section</span> check if the distance between any bullet and asteroid is less than the asteroid's size, and if so, remove the bullet and asteroid from their respective lists.<br/>
            <CodeBlock className="lecture-codeblock" language="python"
            code={`# nested loop\n for i_b in range(len(bx)):\n     for i_a in range(len(ax)):\n         dist = math.hypot(ax[i_a] - bx[i_b], ay[i_a] - by[i_b])`} />
            Optionally spawn a few smaller asteroids when a large asteroid is destroyed to make the game more interesting.
          </li>
        </ul>

        {solutionsUnlocked ? (
          <>
            <div className="lecture-solutions-divider"><span className="lecture-solutions-label">Solution</span></div>
            <CodeBlock className="lecture-codeblock" language="python"
              code={`import pygame
import math
import time
import random

# --- Window settings ---
WIDTH, HEIGHT  = 800, 600
SIZE           = 15     # fighter triangle half-size
BULLET_SPEED   = 600    # pixels/s
BULLET_RADIUS  = 4
NUM_ASTEROIDS  = 8      # starting asteroid count
MIN_ASTEROIDS  = 5      # respawn threshold
AST_SPEED      = 80     # max asteroid drift speed (pixels/s)

# Physics constants
THRUST   = 250
ROTATE   = 3.0
FRICTION = 0.4

# --- Fighter state ---
px, py = WIDTH / 2, HEIGHT / 2
vx, vy = 0.0, 0.0
angle  = -math.pi / 2   # facing up
alive  = True

# --- Bullet lists ---
bx, by, bvx, bvy = [], [], [], []

# --- Asteroid lists ---
ax, ay, avx, avy, ar = [], [], [], [], []   # pos, velocity, radius

def spawn_asteroid(avoid_x, avoid_y, min_dist=120):
    """Add one random asteroid, skipping positions too close to (avoid_x, avoid_y)."""
    for _ in range(100):   # try up to 100 times
        x = random.random() * WIDTH
        y = random.random() * HEIGHT
        if math.hypot(x - avoid_x, y - avoid_y) < min_dist:
            continue       # too close, try again
        speed = random.uniform(20, AST_SPEED)
        direction = random.uniform(0, 2 * math.pi)
        ax.append(x);  ay.append(y)
        avx.append(math.cos(direction) * speed)
        avy.append(math.sin(direction) * speed)
        ar.append(random.randint(18, 40))   # radius in pixels
        return

# Populate starting asteroids
for _ in range(NUM_ASTEROIDS):
    spawn_asteroid(px, py)

# --- Setup ---
pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Asteroids")
font  = pygame.font.SysFont(None, 32)
clock = pygame.time.Clock()

last_frame = time.time()
running    = True
message    = ""

while running:
    # ---- Event Section ----
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Delta time
    now        = time.time()
    dt         = now - last_frame
    last_frame = now

    if alive:
        # ---- Input Section ----
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            angle -= ROTATE * dt
        if keys[pygame.K_RIGHT]:
            angle += ROTATE * dt
        if keys[pygame.K_UP]:
            vx += math.cos(angle) * THRUST * dt
            vy += math.sin(angle) * THRUST * dt
        if keys[pygame.K_DOWN]:
            vx -= math.cos(angle) * THRUST * dt
            vy -= math.sin(angle) * THRUST * dt
        if keys[pygame.K_SPACE]:
            bx.append(px + SIZE * math.cos(angle))
            by.append(py + SIZE * math.sin(angle))
            bvx.append(math.cos(angle) * BULLET_SPEED)
            bvy.append(math.sin(angle) * BULLET_SPEED)

        # ---- Update Section ----
        # Fighter movement with friction
        decay = FRICTION ** dt
        vx *= decay;  vy *= decay
        px = (px + vx * dt) % WIDTH
        py = (py + vy * dt) % HEIGHT

        # Move bullets and remove off-screen ones
        for i in range(len(bx)):
            bx[i] += bvx[i] * dt
            by[i] += bvy[i] * dt
        for i in range(len(bx) - 1, -1, -1):
            if bx[i] < 0 or bx[i] > WIDTH or by[i] < 0 or by[i] > HEIGHT:
                bx.pop(i); by.pop(i); bvx.pop(i); bvy.pop(i)

        # Move asteroids and wrap at screen edges
        for i in range(len(ax)):
            ax[i] = (ax[i] + avx[i] * dt) % WIDTH
            ay[i] = (ay[i] + avy[i] * dt) % HEIGHT

        # Fighter vs asteroid collision
        for i in range(len(ax)):
            if math.hypot(ax[i] - px, ay[i] - py) < ar[i] + SIZE:
                alive   = False
                message = "Game Over!"
                break

        # Bullet vs asteroid collision (iterate backwards to safely remove)
        for i_b in range(len(bx) - 1, -1, -1):
            for i_a in range(len(ax) - 1, -1, -1):
                if i_b >= len(bx) or i_a >= len(ax):
                    continue   # already removed this frame
                if math.hypot(ax[i_a] - bx[i_b], ay[i_a] - by[i_b]) < ar[i_a]:
                    # Split large asteroids into two smaller ones
                    if ar[i_a] > 20:
                        for _ in range(2):
                            speed = random.uniform(40, AST_SPEED)
                            d     = random.uniform(0, 2 * math.pi)
                            ax.append(ax[i_a]);  ay.append(ay[i_a])
                            avx.append(math.cos(d) * speed)
                            avy.append(math.sin(d) * speed)
                            ar.append(ar[i_a] // 2)
                    bx.pop(i_b); by.pop(i_b); bvx.pop(i_b); bvy.pop(i_b)
                    ax.pop(i_a); ay.pop(i_a); avx.pop(i_a); avy.pop(i_a); ar.pop(i_a)
                    break

        # Respawn asteroids when count drops below threshold
        while len(ax) < MIN_ASTEROIDS:
            spawn_asteroid(px, py)

    # ---- Draw Section ----
    screen.fill((0, 0, 20))

    # Fighter (only draw if alive)
    if alive:
        nose  = (px + SIZE * math.cos(angle),       py + SIZE * math.sin(angle))
        left  = (px + SIZE * math.cos(angle + 2.4), py + SIZE * math.sin(angle + 2.4))
        right = (px + SIZE * math.cos(angle - 2.4), py + SIZE * math.sin(angle - 2.4))
        pygame.draw.polygon(screen, (255, 255, 255), [nose, left, right])

    # Bullets
    for i in range(len(bx)):
        pygame.draw.circle(screen, (255, 80, 80), (int(bx[i]), int(by[i])), BULLET_RADIUS)

    # Asteroids
    for i in range(len(ax)):
        pygame.draw.circle(screen, (120, 100, 80), (int(ax[i]), int(ay[i])), int(ar[i]), 2)

    # Game over message
    if message:
        label = font.render(message, True, (255, 255, 100))
        screen.blit(label, (WIDTH // 2 - label.get_width() // 2, HEIGHT // 2))

    pygame.display.flip()
    clock.tick(60)

pygame.quit()`} />
          </>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-400/40 bg-gray-100/40 dark:bg-gray-800/30 px-5 py-4 my-4 tc2" style={{ fontSize: displayMode === 'slideshow' ? '1.2vw' : '0.9rem' }}>
            <span className="text-2xl">&#x1f512;</span>
            <span>Solution unlocked after class on <span className="lecture-bold">{UNLOCK_TIME.toLocaleString()}</span>.</span>
          </div>
        )}
      </section>

    </LectureTemplate>
  );
}

interface Exercises2LectureIconProps {
  displayMode?: 'list' | 'card';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

function Exercises2LectureIcon(props: Exercises2LectureIconProps | null) {
  const { displayMode = 'card', className = '', style, onClick } = props || {};
  return (
    <LectureIcon title="Exercises 2" summary="Walk through intermediate exercises combining multiple concepts." displayMode={displayMode} className={className} style={style} onClick={onClick} />
  );
}

export { Exercises2Lecture, Exercises2LectureIcon };
