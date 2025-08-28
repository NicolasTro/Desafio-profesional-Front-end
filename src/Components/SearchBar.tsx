"use client"
import '@fortawesome/fontawesome-free/css/all.min.css';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';


type SearchBarProps = {
    placeholder: string;
    width?: number | string;
    height?: number | string;
};


export default function SearchBar( props: SearchBarProps) {


    return (
    <Stack spacing={1.5}>
      <Input
        placeholder={props.placeholder}
        startDecorator={<i className="fas fa-search" style={{ color: 'gray' }}></i>}
        sx={{ width: props.width || 280, height: props.height || 64 }}
      />
    </Stack>
  );
}

