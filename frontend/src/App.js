import React from 'react';
import BusinessProfileForm from './components/BusinessProfileForm';
import BusinessProfileList from './components/BusinessProfileList';
import './App.css';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <h1>SALMA - Business Profile</h1>
      </header>
      <main>
        <BusinessProfileForm />
        <BusinessProfileList />
      </main>
    </div>
  );
}

export default App;
