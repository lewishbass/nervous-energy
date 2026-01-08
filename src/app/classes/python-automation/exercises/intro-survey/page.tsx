"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useAuth } from '@/context/AuthContext';

import { QuestionComponent, SlideQuestionComponent, TextQuestionComponent, CheckboxQuestionComponent, RadioQuestionComponent } from './questionparts';
import { sub } from '@tensorflow/tfjs-core';

const SUBMIT_ROUTE = '/.netlify/functions/classwork';


export default function IntroSurvey() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    experience: 0,
    pythonExperience: '',
    uses: '',
    dayJob: '',
    interests: [] as string[],
    availability: ''
  });

  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const [submissionState, setSubmissionState] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');

  const { isLoggedIn, username, token } = useAuth();

  const clearSubmissionStateTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if(submissionState === 'idle' || submissionMessage == null) return;
    if(clearSubmissionStateTimer.current) {
      clearTimeout(clearSubmissionStateTimer.current);
    }
    setTimeout(() => {
      if (submissionState === 'submitted') {
        router.push('/classes/python-automation?tab=exercises')
      }
      setSubmissionState('idle');
      setSubmissionMessage(null);
    }, 5000);
    return () => {
      if(clearSubmissionStateTimer.current) {
        clearTimeout(clearSubmissionStateTimer.current);
      }
    };

  },[submissionState, submissionMessage]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle survey submission
    console.log('Survey submitted:', formData);
    //router.push('/classes/python-automation?tab=syllabus');

    setSubmissionState('submitting');
    setSubmissionMessage('Submitting your survey...');

    try {
      if (!username || !token || !isLoggedIn) {
        throw new Error('You must be logged in to submit the survey.');
      }
      if (submissionState === 'submitting') {
        throw new Error('Your survey is already being submitted. Please wait.');
      }
      const response = await fetch(SUBMIT_ROUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submit_assignment',
          username,
          token,
          className: 'python-automation',
          assignmentName: 'intro-survey',
          submissionData: formData,
        }),
      });
      if (!response.ok) {
        throw new Error(response.statusText || 'Failed to process submission.');
      }
      const data = await response.json();
      setSubmissionState('submitted');
      setSubmissionMessage(data.message || 'Submitted!');
    }
    catch (error) {
      setSubmissionState('error');
      setSubmissionMessage(error instanceof Error ? error.message : 'An error occurred while submitting the survey.');
      return;
    }
  };

  const handleCheckboxChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  if (!isLoggedIn) {
    return (
      <div className="p-6 max-w-4xl mx-auto mb-20">
        <p className="tc1 text-2xl">Please <span className="font-bold hover:opacity-70 cursor-pointer text-indigo-500 bg-green-300 p-2 px-3 rounded-full transition-all duration-300" onClick={() => router.push('/classes/python-automation/exercises/intro-survey?openAuth=true')}>log in / register</span> to access the survey.</p>
        
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto mb-20">
      {/* Header */}
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
          <div>
            <h1 className="text-4xl font-bold tc1">Introduction Survey</h1>
            <p className="tc2 text-lg mt-2">Python for Automation and Scripting</p>
            <p className="tc3 text-sm">Help us understand your background and goals</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextQuestionComponent
          questionText="What is your name?"
          value={formData.name}
          setValue={(value) => setFormData(prev => ({ ...prev, name: value as string }))}
          placeholder="Full name"
          required
        />
        
        <SlideQuestionComponent 
          questionText="What is your programming experience level?" 
          value={formData.experience} 
          setValue={(value) => setFormData(prev => ({ ...prev, experience: value as number }))} 
          min={0}
          max={10}
          step={0.01}
          labels={['None', 'Dabbled', 'Regular', 'Expert']}
        />

        <TextQuestionComponent
          questionText="How familiar are you with Python?"
          value={formData.pythonExperience}
          setValue={(value) => setFormData(prev => ({ ...prev, pythonExperience: value as string }))}
          placeholder="Describe your familiarity with Python"
          required
          multiline
        />

        <TextQuestionComponent
          questionText="What is your day job?"
          value={formData.dayJob}
          setValue={(value) => setFormData(prev => ({ ...prev, dayJob: value as string }))}
          placeholder="Where you will apply these skills"
          required
        />


        

        {/* Goals */}
        <TextQuestionComponent 
          questionText="What will you use Python automation skills for?" 
          value={formData.uses} 
          setValue={(value) => setFormData(prev => ({ ...prev, uses: value as string }))}
          placeholder="Describe what you hope to achieve..."
          multiline
          required
        />

        {/* Availability */}
        <RadioQuestionComponent
          questionText="How many hours per week can you dedicate to coursework?"
          value={formData.availability}
          setValue={(value) => setFormData(prev => ({ ...prev, availability: value as string }))}
          options={['0-3 hours', '3-5 hours', '5-10 hours', '10+ hours']}
          required
        />

        {/* Interests */}
        <CheckboxQuestionComponent
          questionText="Which topics interest you most? (Select all that apply)"
          value={formData.interests}
          setValue={(value) => setFormData(prev => ({ ...prev, interests: value as string[] }))}
          options={[
            'Web Scraping',
            'File Automation',
            'Data Processing',
            'API Integration',
            'Task Scheduling',
            'Report Generation',
            'App Development',
            'AI & Machine Learning',
          ]}
        />

        {/* Submit Button */}
        <div className="flex gap-4 justify-end items-center">
          <span>
            {submissionMessage && (
              <span className={`text-${submissionState === 'error' ? 'red-500' : (submissionState === 'submitted' ? 'green-500' : 'gray-500')}`}>{submissionMessage}</span>
            )}
          </span>
          <button
            type="button"
            onClick={() => router.push('/classes/python-automation')}
            className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 tc2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer select-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-6 py-3 rounded-lg ${submissionState === 'idle' ? 'bg-blue-600' : submissionState === 'submitting' ? 'bg-yellow-400' : submissionState === 'submitted' ? 'bg-green-600' : 'bg-red-600'} text-white hover:opacity-90 transition-all duration-300 font-semibold select-none ${submissionState !== 'idle' ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={submissionState !== 'idle'}
          >
            Submit Survey
          </button>
        </div>
      </form>
    </div>
  );
}
