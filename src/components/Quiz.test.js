import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Quiz from '../Quiz';

describe('Quiz Component', () => {
    test('renders quiz with title', () => {
        render(<Quiz />);
        const title = screen.getByText('My Questions');
        expect(title).toBeInTheDocument();
    });

    test('renders all questions', () => {
        render(<Quiz />);
        expect(screen.getByText('What is the capital of Connecticut?')).toBeInTheDocument();
        expect(screen.getByText('What is the square root of 16?')).toBeInTheDocument();
        expect(screen.getByText('What type of number is 101?')).toBeInTheDocument();
    });

    test('renders all answer options', () => {
        render(<Quiz />);
        expect(screen.getByLabelText('Stamford')).toBeInTheDocument();
        expect(screen.getByLabelText('Hartford')).toBeInTheDocument();
        expect(screen.getByLabelText('4')).toBeInTheDocument();
        expect(screen.getByLabelText('prime')).toBeInTheDocument();
    });

    test('renders Done button', () => {
        render(<Quiz />);
        const button = screen.getByText('Done');
        expect(button).toBeInTheDocument();
    });

    test('shows progress counter', () => {
        render(<Quiz />);
        const progress = screen.getByText(/Progress:/);
        expect(progress).toBeInTheDocument();
    });

    test('displays correct answer alerts', () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        render(<Quiz />);

        const correctAnswer = screen.getByLabelText('Hartford');
        fireEvent.click(correctAnswer);

        expect(window.alert).toHaveBeenCalledWith('You are correct!');
        window.alert.mockRestore();
    });

    test('displays incorrect answer alerts', () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        render(<Quiz />);

        const incorrectAnswer = screen.getByLabelText('Stamford');
        fireEvent.click(incorrectAnswer);

        expect(window.alert).toHaveBeenCalledWith('Sorry - not correct');
        window.alert.mockRestore();
    });

    test('handles multiple answer clicks', () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        render(<Quiz />);

        const correctAnswer1 = screen.getByLabelText('Hartford');
        const correctAnswer2 = screen.getByLabelText('4');

        fireEvent.click(correctAnswer1);
        fireEvent.click(correctAnswer2);

        expect(window.alert).toHaveBeenCalledTimes(2);
        expect(window.alert).toHaveBeenCalledWith('You are correct!');
        window.alert.mockRestore();
    });

    test('calls onQuizComplete callback when Done button is clicked', () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        const mockOnComplete = jest.fn();
        render(<Quiz onQuizComplete={mockOnComplete} />);

        const doneButton = screen.getByText('Done');
        fireEvent.click(doneButton);

        expect(mockOnComplete).toHaveBeenCalledWith(
            expect.objectContaining({
                score: expect.any(Number),
                count: expect.any(Number),
                percentage: expect.any(Number),
                formatted: expect.any(String)
            })
        );
        window.alert.mockRestore();
    });

    test('provides access to ScoreController for assertions', () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        const { container } = render(<Quiz />);

        // Find and click correct answers
        const correctAnswers = container.querySelectorAll('input[value="true"]');
        correctAnswers.forEach(input => {
            if (input.getAttribute('value') === 'true') {
                fireEvent.click(input);
            }
        });

        window.alert.mockRestore();
    });
});

describe('Quiz Component Integration', () => {
    test('complete quiz flow', () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        const mockOnComplete = jest.fn();
        render(<Quiz onQuizComplete={mockOnComplete} />);

        // Answer first question correctly
        fireEvent.click(screen.getByLabelText('Hartford'));

        // Answer second question correctly
        fireEvent.click(screen.getByLabelText('4'));

        // Answer third question correctly
        fireEvent.click(screen.getByLabelText('prime'));

        // Click Done
        const doneButton = screen.getByText('Done');
        fireEvent.click(doneButton);

        // Verify callback was called with expected data
        expect(mockOnComplete).toHaveBeenCalledWith(
            expect.objectContaining({
                score: 3,
                count: 3,
                percentage: 100,
                formatted: '3/3'
            })
        );

        window.alert.mockRestore();
    });

    test('mixed correct and incorrect answers', () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        const mockOnComplete = jest.fn();
        render(<Quiz onQuizComplete={mockOnComplete} />);

        // Answer first question incorrectly
        fireEvent.click(screen.getByLabelText('Stamford'));

        // Answer second question correctly
        fireEvent.click(screen.getByLabelText('4'));

        // Answer third question incorrectly
        fireEvent.click(screen.getByLabelText('composite'));

        // Click Done
        const doneButton = screen.getByText('Done');
        fireEvent.click(doneButton);

        // Verify callback was called with expected data
        expect(mockOnComplete).toHaveBeenCalledWith(
            expect.objectContaining({
                score: 1,
                count: 3,
                percentage: 33,
                formatted: '1/3'
            })
        );

        window.alert.mockRestore();
    });
});
