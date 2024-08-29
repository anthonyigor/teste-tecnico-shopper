import * as Yup from 'yup';

export const isBase64Image = (str: string): boolean => {
    if (!str.startsWith('data:image/')) {
      return false;
    }
  
    // Divide a string em duas partes: a parte dos metadados e a parte codificada em base64
    const parts = str.split(',');
    if (parts.length !== 2) {
      return false;
    }

    if (parts[1].length % 4 !== 0) {
        return false;
    }
  
    // Expressão regular para verificar se a segunda parte é uma string base64 válida
    const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
  
    return base64Pattern.test(parts[1]);
}

export const uploadSchema = Yup.object().shape({
    image: Yup.string().required('Image is required').test('is-base64-image', 'Invalid base64 image', isBase64Image),
    customer_code: Yup.string(),
    measure_datetime: Yup.string().required('Measure datetime is required'),
    measure_type: Yup.string()
    .required('Measure type is required')
    .test('is-valid-measure-type', 'Measure type must be either "water" or "gas"', value => {
      const normalizedValue = value.toUpperCase();
      return ['WATER', 'GAS'].includes(normalizedValue);
    })
})

export const confirmSchema = Yup.object().shape({
  measure_uuid: Yup.string().required('Measure uuid is required'),
  confirmed_value: Yup.number().required('Confirmed value is required')
})

