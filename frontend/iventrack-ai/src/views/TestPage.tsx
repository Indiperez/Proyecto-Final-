import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

interface TestResult {
    test: string;
    success: boolean;
    message: string;
    userCount?: number;
    productCount?: number;
}

export const TestPage = () => {
    const [testResults, setTestResults] = useState<TestResult[]>([]);

    // Test database connection
    const { isLoading: connectionLoading } = useQuery({
        queryKey: ['test-connection'],
        queryFn: async () => {
            const response = await api.get('/api/test/connection');
            return response.data;
        },
        enabled: false,
    });

    // Test Usuarios table
    const { isLoading: usuariosLoading } = useQuery({
        queryKey: ['test-usuarios'],
        queryFn: async () => {
            const response = await api.get('/api/test/usuarios');
            return response.data;
        },
        enabled: false,
    });

    // Test user registration
    const { mutate: testRegistration, isPending: registrationLoading } = useMutation({
        mutationFn: async () => {
            const response = await api.post('/api/test/test-register');
            return response.data;
        },
    });

    const runAllTests = async () => {
        setTestResults([]);

        try {
            // Test 1: Database connection
            const connResponse = await api.get('/api/test/connection');
            setTestResults(prev => [...prev, { test: 'Database Connection', ...connResponse.data }]);

            // Test 2: Usuarios table
            const usuariosResponse = await api.get('/api/test/usuarios');
            setTestResults(prev => [...prev, { test: 'Usuarios Table', ...usuariosResponse.data }]);

            // Test 3: User registration
            const regResponse = await api.post('/api/test/test-register');
            setTestResults(prev => [...prev, { test: 'User Registration', ...regResponse.data }]);

        } catch (error: any) {
            setTestResults(prev => [...prev, {
                test: 'Error',
                success: false,
                message: error.response?.data?.message || error.message
            }]);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Database and API Tests</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Test Database Connection</CardTitle>
                        <CardDescription>Check if the backend can connect to your Hostinger database</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => api.get('/api/test/connection').then(r => setTestResults(prev => [...prev, { test: 'Database Connection', ...r.data }]))}
                            disabled={connectionLoading}
                        >
                            {connectionLoading ? 'Testing...' : 'Test Connection'}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Test Usuarios Table</CardTitle>
                        <CardDescription>Check if the Usuarios table exists and is accessible</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => api.get('/api/test/usuarios').then(r => setTestResults(prev => [...prev, { test: 'Usuarios Table', ...r.data }]))}
                            disabled={usuariosLoading}
                        >
                            {usuariosLoading ? 'Testing...' : 'Test Usuarios Table'}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Test User Registration</CardTitle>
                        <CardDescription>Test if user registration works with your database</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => testRegistration()}
                            disabled={registrationLoading}
                        >
                            {registrationLoading ? 'Testing...' : 'Test Registration'}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Run All Tests</CardTitle>
                    <CardDescription>Run all tests at once to check everything is working</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={runAllTests} className="w-full">
                        Run All Tests
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Test Results</CardTitle>
                    <CardDescription>Results from all tests performed</CardDescription>
                </CardHeader>
                <CardContent>
                    {testResults.length === 0 ? (
                        <p className="text-muted-foreground">No tests run yet. Click a test button above to start.</p>
                    ) : (
                        <div className="space-y-4">
                            {testResults.map((result, index) => (
                                <div key={index} className={`p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                    <h3 className="font-semibold">{result.test}</h3>
                                    <p className={`${result.success ? 'text-green-800' : 'text-red-800'}`}>
                                        {result.message}
                                    </p>
                                    {result.userCount !== undefined && (
                                        <p className="text-sm text-muted-foreground">Users found: {result.userCount}</p>
                                    )}
                                    {result.productCount !== undefined && (
                                        <p className="text-sm text-muted-foreground">Products found: {result.productCount}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};