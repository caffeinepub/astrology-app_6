# Astrology App

## Overview
A bilingual astrology application supporting Hindi and English languages with Hindu calendar features, birth chart generation, AI chat predictions, and premium subscription model with free trial for new users.

## Core Features

### Language Support
- Complete bilingual interface supporting Hindi and English
- Language toggle functionality
- All content and UI elements available in both languages

### Hindi Panchang Section
- Display daily Hindu calendar information
- Show important dates, festivals, and auspicious timings
- Include lunar calendar details and planetary positions

### Kundali Features
- Birth chart generation based on user's birth details (date, time, location)
- Display planetary positions and houses
- Kundali matching functionality for compatibility analysis
- Store generated Kundali data for registered users
- AI chat feature integrated into Kundali page for personalized predictions

### AI Chat Predictions
- Paid AI chat service for birth chart predictions at ₹5 per minute
- Real-time coin deduction during chat sessions
- Balance checking before starting chat sessions
- Clear rate display (₹5/minute) in both Hindi and English
- Prompt users to purchase coins when balance is insufficient
- Chat session timer and cost tracking
- Integration within the Kundali page interface

### Coin System
- In-app virtual currency for premium features and AI chat
- Users can purchase coins to access premium content and AI predictions
- Coin balance tracking and transaction history
- Real-time coin deduction for AI chat usage

### Subscription Model with Free Trial
- First month of premium access is completely free for new users
- After free trial expires, monthly subscription at ₹30 via Stripe payment integration
- Premium features accessible to subscribers and users in free trial period
- Subscription status tracking and renewal management
- Clear indication in onboarding and subscription flows that first month is free

## Data Storage (Backend)
- User profiles with birth details and preferences
- Generated Kundali charts and matching results
- Coin balances and transaction records
- AI chat session history, duration, and costs
- Subscription status, payment history, and free trial tracking
- User registration date to determine free trial eligibility
- Panchang data and astrological information

## Premium Features
- Advanced Kundali analysis
- Detailed compatibility reports
- Extended Panchang information
- Personalized predictions and insights

## Payment Integration
- Stripe integration for subscription payments after free trial
- Secure payment processing for ₹30 monthly subscription
- Automatic subscription renewal handling
- Free trial management without payment requirement

## Free Trial Management
- Automatic premium access for new users for first month
- Trial expiration tracking and notifications
- Seamless transition to paid subscription after trial ends
- Clear messaging about free trial benefits and expiration
