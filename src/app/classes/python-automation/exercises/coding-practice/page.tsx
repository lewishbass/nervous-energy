"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import RandomBackground from '@/components/backgrounds/RandomBackground';
import BackToAssignment from '../exercise-components/BackToAssignment';
import SignInButton from '@/components/SignInButton';

import { getQuestionSubmissionStatus } from '../exercise-components/ExerciseUtils';
import { useEffect } from 'react';

const className = 'python-automation';
const assignmentName = 'coding-game';

const basicConcepts = [
  'assigning ints',
  'assigning strings',
  'assigning arrays',
  'updating variables',
  'printing',
  'number operations',
  'string operations',
  'array operations',
]

const flowConcepts = [
  'updating variables',
  'if statements',
  'else statements',
  'elif trees',
  'for loops',
  'while loops',
  'breaking',
  'continuing',
]

const functionConcepts = [
  'parameters',
  'returning values',
]

const classConcepts = [
  'init method',
  'creating instances',
]

export default function Unit1Quiz() {
  const router = useRouter();
  const { isLoggedIn, username, token } = useAuth();
  
  useEffect(() => {
    if (!isLoggedIn || !username || !token) return;
    const gameStatNames = basicConcepts.concat(flowConcepts, functionConcepts, classConcepts)
  
  }, [isLoggedIn, username, token]);

  if (!isLoggedIn) {
    return (
      
      <div className="p-6 max-w-4xl mx-auto mb-20 min-h-screen">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src="/images/classes/Python-logo-notext.svg"
              alt="Python Logo"
              width={80}
              height={80}
              className="rounded-lg cursor-pointer"
              onClick={() => router.push('/classes/python-automation')}
            />
            <div className="backdrop-blur-sm rounded-lg">
              <h1 className="text-4xl font-bold tc1">Coding Game</h1>
              <p className="tc2 text-lg mt-2">Python for Automation and Scripting</p>
              <p className="tc3 text-sm">Units 1-3: Flow, Functions and Classes</p>
            </div>
          </div>
        </div>
        <p className="tc1 text-2xl mb-4">This Assignment uses an external server to save progress</p>
        <p className="tc1 text-2xl">Please <SignInButton size='lg' inline andRegister /> to continue.</p>
        <div className="p-4 px-8 mt-8">
          <BackToAssignment assignmentPath={"../?tab=exercises"} textOverride="Back to Assignments" />

        </div>
      </div>
    );
  }


  return (
 <>
      <RandomBackground seed={115} density={0.5} doAnimation={false} />
     <div className="p-6 max-w-4xl mx-auto mb-20 min-h-screen">
       <div className="mb-8">
         <div className="flex items-center gap-4 mb-4">
           <Image
             src="/images/classes/Python-logo-notext.svg"
             alt="Python Logo"
             width={80}
             height={80}
             className="rounded-lg cursor-pointer"
             onClick={() => router.push('/classes/python-automation')}
           />
           <div className="backdrop-blur-sm rounded-lg">
             <h1 className="text-4xl font-bold tc1">Coding Game</h1>
             <p className="tc2 text-lg mt-2">Python for Automation and Scripting</p>
             <p className="tc3 text-sm">Units 1-3: Flow, Functions and Classes</p>
           </div>
         </div>
       </div>
 
       <div className="mb-6 tc2 rounded-lg backdrop-blur-sm">
         <span className="text-lg font-bold text-red-400 dark:text-red-600">Important</span> :
          This assignment uses the newer <span className="tc1 font-semibold">worker-based</span> python editor. If it stops working, try refreshing the page.
        </div>
        

 
       <div className="p-4 px-8">
         <BackToAssignment assignmentPath={"../?tab=exercises"} textOverride="Back to Assignments"/>
         
       </div>
     </div>
     </>);
}
