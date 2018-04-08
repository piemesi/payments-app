<?php

namespace App\Http\Controllers;

use App\Service\Account\Models\Wallet;
use App\Service\ApiMethod\AccountApiMethod;
use App\User;
use Illuminate\Http\Request;

class AccountController extends Controller
{

    protected $wallet;

    public function __construct(Wallet $wallet)
    {
        $this->wallet = $wallet;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
//        print_r($request->all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param AccountApiMethod $account
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(AccountApiMethod $account, Request $request)
    {

        print_r([$request->all()]);

        if ($account->validateRequest($request)) {
            $account->processRequest();
        }


        return response()->json([
            'status' => $account->getStatus(),
            'case' => $account->getCase(),
            'message' => $account->getMessage()
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\User $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\User $user
     * @return \Illuminate\Http\Response
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\User $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\User $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        //
    }
}
