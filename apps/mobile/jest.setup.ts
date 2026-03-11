import '@testing-library/react-native/extend-expect'

// Silence noisy logs in tests
jest.spyOn(console, 'log').mockImplementation(() => {})
jest.spyOn(console, 'warn').mockImplementation(() => {})
