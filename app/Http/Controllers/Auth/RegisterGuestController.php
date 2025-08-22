<?php

namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use App\Models\Guest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RegisterGuestController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/RegisterGuest');
    }

    public function store(Request $request)
    {
        $validated =  $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255',
            'phone' => ['required', 'string', 'regex:/^01[0125][0-9]{8}$/'],
            'area' => 'required|string|max:255',
            'street' => 'required|string|max:255',
            'block' => 'required|string|max:255',
            'building' => 'required|string|max:255',
            'complex' => 'nullable|string|max:255',
            'floor_number' => 'nullable|string|max:255',
            'flate_number' => 'nullable|string|max:255',
            'land_mark' => 'nullable|string|max:255',

        ]);

        // Guest::create($validated);
        session(['guest_data' => $validated]);

        return Inertia::render('Welcome/Order/GuestOrder');

    }
}
