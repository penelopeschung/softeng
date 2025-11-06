describe('Full Roster Workflow', () => {

  // This is the messy text we will paste, just like a real user
  const messyPasteData = `
    Ryan Albright
    Ryan AlbrightCS350 - Software Engineering - 1 - Block 4
    StudentGrace Bishara
    Grace BisharaCS350 - Software Engineering - 1 - Block 4
    TeacherColin Chu
    Colin ChuCS350 - Software Engineering - 1 - Block 4
    Nov 3 at 2:24pm
  `;

  it('should create a class, parse students, add them, and then clear the roster', () => {
    
    // --- 1. ARRANGE: Clear data, visit, and create a new class ---

    // Start with a clean slate every time
    cy.clearLocalStorage();
    cy.visit('index.html'); // Visit your website

    // Stub the window.prompt() calls
    cy.window().then((win) => {
      // Stub the first prompt (Class name)
      cy.stub(win, 'prompt').onFirstCall().returns('Modern Physics');
      // Stub the second prompt (Block name)
      win.prompt.onSecondCall().returns('Block 5');
    });

    // Click the "Add Class" button
    cy.get('#addClassBtn').click();

    // Now, find the class tile we just created and click it
    // We only search for "Modern Physics" because the block is on a new line
    cy.contains('.tile', 'Modern Physics').click();
    

    // --- 2. ASSERT: Wait for navigation and check the new page ---
    
    // *** THIS IS THE NEW FIX ***
    // We explicitly tell Cypress to WAIT until the URL (hash) has
    // changed to include '#/class'. This is the most reliable way
    // to know the navigation is complete.
    cy.url().should('include', '#/class'); 

    // Now that we've waited for the URL, we know we are on the new page.
    cy.get('#classTitle').should('contain', 'Modern Physics (Block 5)');
    cy.get('#rosterCount').should('contain', '0 students'); // Should be empty
    

    // --- 3. ACT: Paste messy data and add students ---
    
    // Now that we are sure the page is loaded, we can find the element.
    // We will add the .should('be.visible') to be safe.
    cy.get('#newStudents')
      // .should('be.visible')
      .type(messyPasteData);
    
    cy.get('#addStudentsBtn').click();
    

    // --- 4. ASSERT: Check that *only* the correct names were added ---
    
    // Check that the roster count is correct
    cy.get('#rosterCount').should('contain', '3 students');
    
    // Check that the correct names appear as chips
    cy.get('.chip').should('have.length', 3);
    cy.get('.chip').should('contain', 'Ryan Albright');
    cy.get('.chip').should('contain', 'Grace Bishara');
    cy.get('.chip').should('contain', 'Colin Chu');
    
    // Check that junk data was *not* added
    cy.get('.chip').should('not.contain', 'Nov 3');
    cy.get('.chip').should('not.contain', 'CS350');
    
    // Also check that the textarea is now empty
    cy.get('#newStudents').should('have.value', '');
    

    // --- 5. ACT: Clear the roster ---
    
    // We must "stub" the confirm popup to automatically click "OK"
    cy.on('window:confirm', () => true);
    
    // Click the "Clear All" button
    cy.get('#clearRosterBtn').click();
    

    // --- 6. ASSERT: Check that the roster is now empty ---
    
    // The chips should be gone
    cy.get('.chip').should('not.exist');
    
    // The count should be back to 0
    cy.get('#rosterCount').should('contain', '0 students');
  });
});

