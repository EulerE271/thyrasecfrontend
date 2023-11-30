// CreateNewUserModal.tsx

import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

interface CreateNewUserModalProps {
  open: boolean;
  onClose: () => void;
  onUserCreated: (newUser: any) => void; // Replace 'any' with the actual user type
}

const CreateNewUserModal: React.FC<CreateNewUserModalProps> = ({
  open,
  onClose,
  onUserCreated,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleCreateNewUser = async () => {
    // Construct the data to send
    const userData = {
      username,
      email,
      password,
      // Only include companyName if the role is 'advisor'
      ...(role === "advisor" && { company_name: companyName }),
    };

    // Define the base URL

    // Set the endpoint based on the role
    let endpoint = "";
    switch (role) {
      case "admin":
        endpoint = "/admin";
        break;
      case "advisor": // Assuming 'advisor' corresponds to 'partner' in your API
        endpoint = "/partner";
        break;
      case "customer":
        endpoint = "/customer";
        break;
      default:
        console.error("Invalid role selected");
        return;
    }

    try {
      // Post the data to the specific endpoint based on the role
      const response = await axios.post(`v1/register${endpoint}`, userData, {
        withCredentials: true,
      });
      onUserCreated(response.data);
      setPassword("")
      setEmail("")
      setRole("")
      setUsername("") // Notify the parent component of the newly created user
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error creating the user:", error);
      // Handle the error, maybe show a message to the user
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        {/* Username Field */}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        {/* Email Field */}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        {/* Role Field */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="role-select-label">Role</InputLabel>
          <Select
            labelId="role-select-label"
            id="role-select"
            value={role}
            label="Role"
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="advisor">Advisor</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {role === "advisor" && (
          <TextField
            label="Company Name"
            variant="outlined"
            fullWidth
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleCreateNewUser}
          variant="contained"
          color="primary"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateNewUserModal;
