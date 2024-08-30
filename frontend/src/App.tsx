import React, { useState } from 'react';
import { backend } from 'declarations/backend';
import { Button, Container, Grid, Paper, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  fontSize: '1.25rem',
  padding: theme.spacing(2),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = async (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = await backend.calculate(operator, firstOperand, inputValue);
      if (result !== null) {
        setDisplay(result.toString());
        setFirstOperand(result);
      } else {
        setDisplay('Error');
      }
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  return (
    <Container maxWidth="sm">
      <StyledPaper elevation={3}>
        <TextField
          fullWidth
          variant="outlined"
          value={display}
          InputProps={{
            readOnly: true,
            style: { fontSize: '2rem', textAlign: 'right' }
          }}
        />
        <Grid container spacing={1} mt={2}>
          {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
            <Grid item xs={3} key={btn}>
              <StyledButton
                fullWidth
                variant="contained"
                color={['/', '*', '-', '+', '='].includes(btn) ? 'primary' : 'secondary'}
                onClick={() => {
                  if (btn === '=') {
                    performOperation('=');
                  } else if (['+', '-', '*', '/'].includes(btn)) {
                    performOperation(btn);
                  } else if (btn === '.') {
                    inputDecimal();
                  } else {
                    inputDigit(btn);
                  }
                }}
              >
                {btn}
              </StyledButton>
            </Grid>
          ))}
          <Grid item xs={12}>
            <StyledButton
              fullWidth
              variant="contained"
              color="error"
              onClick={clear}
            >
              Clear
            </StyledButton>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  );
};

export default App;
